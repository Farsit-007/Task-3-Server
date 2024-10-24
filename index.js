const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const nodemailer = require("nodemailer");
const { ImapFlow } = require('imapflow');
const cron = require('node-cron');
const port = process.env.PORT || 5000

const SMTP_userRouter = require("./routes/smtp_users.route")
const General_userRouter = require("./routes/general_users.route")
const campaign_dataRouter = require("./routes/campaign_data.route")
const replied_EmailRouter = require("./routes/replied_email.route");
const client = require('./connection');

app.use(cors())
app.use(express.json())
app.use(SMTP_userRouter)
app.use(General_userRouter)
app.use(campaign_dataRouter)
app.use(replied_EmailRouter)

async function run() {
    try {
        const smtpUsersCollection = client.db('task3').collection('users');
        const emailRepliesCollection = client.db('task3').collection('email_replies')

        app.post("/send-to-users", async (req, res) => {
            const { name, subject, userEmail, smtpEmail,body} = req.body;
            console.log(body);

            // Fetch SMTP credentials
            const smtpConfigEmail = await smtpUsersCollection.findOne({ smtpUser: smtpEmail });

            if (!smtpConfigEmail) {
                return res.status(404).send("SMTP email not found");
            }

            // Set up Nodemailer SMTP transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: smtpConfigEmail.smtpUser,
                    pass: smtpConfigEmail.smtpPassword,
                },
            });

            // Send email
            const mailBody = {
                from: `${name} <${smtpConfigEmail.smtpUser}>`,
                to: userEmail.join(','),
                subject: subject,
                html: `${body}`,
            };

            transporter.sendMail(mailBody, (error, info) => {
                if (error) {
                    console(error);
                    return res.status(500).send("Error sending email");
                } else {
                    console.log(info.response);
                    res.status(200).send("Email sent successfully!");
                }
            });
        });

        const checkEmailReplies = async () => {
            const smtpConfigs = await smtpUsersCollection.find().toArray();

            for (const smtpConfig of smtpConfigs) {
                const imapClient = new ImapFlow({
                    host: 'imap.gmail.com',
                    port: 993,
                    secure: true,
                    auth: {
                        user: smtpConfig.smtpUser,
                        pass: smtpConfig.smtpPassword
                    }
                });

                try {
                    await imapClient.connect();
                    console.log(`${smtpConfig.smtpUser}`);

                    const lock = await imapClient.getMailboxLock('INBOX');
                    try {
                        const messages = await imapClient.search({ seen: false }); // Search unread emails
                        for await (let msg of imapClient.fetch(messages, { envelope: true, source: true })) {

                            // Extract email body  msg.source 
                            let rawEmail = msg.source.toString();

                            // Use regex to strip headers and extract the body
                            const emailBody = rawEmail.split("\r\n\r\n").slice(1).join("\r\n").trim(); // Assumes headers end after the first empty line

                            const cleanedSubject = msg.envelope.subject.replace(/^Re:\s*/i, ''); 

                            const reply = {
                                from: msg.envelope.from[0].address,
                                subject: cleanedSubject, 
                                body: emailBody
                            };

                            
                            const existingReply = await emailRepliesCollection.findOne({
                                from: reply.from,
                                subject: reply.subject,
                                body: reply.body
                            });

                            if (!existingReply) {
                                await emailRepliesCollection.insertOne(reply);
                            } 
                        }
                    } finally {
                        lock.release();
                    }
                    await imapClient.logout();
                } catch (error) {
                    console.error( error);
                }
            }
        };

        // app.get('/api/check-email-replies', async (req, res) => {
        //     try {
        //         await checkEmailReplies(); 
        //         res.status(200).send("Checked for new email replies");
        //     } catch (error) {
        //         console.error(error);
        //         res.status(500).send("Error checking email replies");
        //     }
        // });
        

        // Schedule the task to check for new email replies every minute
        cron.schedule('*/1 * * * *', async () => {
            console.log("Checking for new email replies...");
            await checkEmailReplies();
        });


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})