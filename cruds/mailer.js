// require('dotenv').config();
// const pool = require('./poolfile');
// const axios = require('axios');
// const nodemailer = require('nodemailer');
// const Imap = require('imap');
// const { simpleParser } = require('mailparser');

// // Gmail credentials
// const senderEmail = 'admin@tankak.tech';
// const senderPassword = 'Takue@#$123'
// const subject = 'TANTAK E-LEARNING';
// const bodyApplicationForm = '';

// // Determine which email service to use (Gmail or Titan Mail)
// // const emailService = process.env.EMAIL_SERVICE || 'gmail'; 

// let smtpServer, smtpPort, imapServer, imapPort;

// smtpServer = 'smtp.hostinger.com';
// smtpPort = 465;
// imapServer = 'imap.hostinger.com';
// imapPort = 993;

// const crudsObj = {};

// // crudsObj.sendOtpEmail = (username, user_email, otp) => {
// //     return new Promise(async (resolve, reject) => {
// //         resolve({ status: '200', message: 'sent successfully' });
// //     }
// //     );
// // };
// crudsObj.sendOtpEmail = (username, user_email, otp) => {
//     return new Promise(async (resolve, reject) => {
//         const body = `<h2 style='color: blue;'> Welcome to TANTAK E-Learning! </h2> 
//                       <p style='color: #000000; margin-top: 33px;'> 
//                       Hi ${username}.</p> 
//                       To help you get started, we've sent you a <br/> One-Time 
//                       Password (OTP) to complete your registration. <br/><br/>
//                       Your OTP is: 
//                       <b>${otp}</b>  
//                       </p>
//                       <p style='margin-top: 25px'><br>
//                       <b>TANTAK DIGITAL SOLUTIONS</b><br />
//                       </p>`;

//         try {
//             // Create a nodemailer transporter using SMTP
//             const transporter = nodemailer.createTransport({
//                 host: smtpServer,
//                 port: smtpPort,
//                 secure: false, 
//                 auth: {
//                     user: senderEmail,
//                     pass: senderPassword,
//                 },
//                 tls: {
//                     rejectUnauthorized: false 
//                 }
//             });

//             // Create the email options
//             const mailOptions = {
//                 from: senderEmail,
//                 to: user_email,
//                 subject: subject,
//                 html: body,
//             };

//             // Send the email
//             const info = await transporter.sendMail(mailOptions);
//             console.log('Email sent successfully.');
//             console.log('Info object:', info);

//             resolve({ status: '200', message: 'sent successfully' });
//         } catch (error) {
//             console.error('Error sending email:', error);
//             reject(error);
//         }
//     });
// };

// // crudsObj.sendOtpEmailForgotPass = (username, user_email, otp) => {
// //     return new Promise(async (resolve, reject) => {
// //         resolve({ status: '200', message: 'sent successfully' });
// //     }
// //     );
// // };

// crudsObj.sendOtpEmailForgotPass = (user_email, otp) => {
//     return new Promise(async (resolve, reject) => {
//         const body = `<h2 style='color: blue;'> TANTAK DIGITAL SOLUTIONS</h2> 
//                       <p style='color: #000000; margin-top: 33px;'> 
//                       Hi!</p> 
//                       Please enter the OTP below to verify your identity and reset you password. <br/><br/>
//                       Your OTP is: 
//                       <b>${otp}</b>  <br><br>
//                       </p>
//                        <p style='margin-top: 25px'><br>
//                        <b>TANTAK DIGITAL SOLUTIONS</b><br />
//                        </p>`;

//         try {
//             // Create a nodemailer transporter using SMTP
//             const transporter = nodemailer.createTransport({
//                 host: smtpServer,
//                 port: smtpPort,
//                 secure: false,
//                 auth: {
//                     user: senderEmail,
//                     pass: senderPassword,
//                 },
//                 tls: {
//                     rejectUnauthorized: false
//                 }
//             });

//             // Create the email options
//             const mailOptions = {
//                 from: senderEmail,
//                 to: user_email,
//                 subject: subject,
//                 html: body,
//             };

//             // Send the email
//             const info = await transporter.sendMail(mailOptions);
//             console.log('Email sent successfully.');
//             console.log('Info object:', info);

//             resolve({ status: '200', message: 'sent successfully' });
//         } catch (error) {
//             console.error('Error sending email:', error);
//             reject(error);
//         }
//     });
// };

// module.exports = crudsObj;

require('dotenv').config();
const nodemailer = require('nodemailer');

// Hostinger email credentials
const senderEmail = process.env.SENDER_EMAIL || 'admin@tankak.tech'; // Use environment variable for security
const senderPassword = process.env.SENDER_PASSWORD || 'Takue@#$123'; // Use environment variable for security
const subject = 'TANTAK E-LEARNING - OTP Verification';

// SMTP server settings
const smtpServer = 'smtp.hostinger.com';
const smtpPort = 465; // SSL port

// CRUD operations object
const crudsObj = {};

// Function to send OTP email
crudsObj.sendOtpEmail = (username, user_email, otp) => {
    return new Promise(async (resolve, reject) => {
        const body = `
            <h2 style='color: blue;'>Welcome to TANTAK E-Learning!</h2> 
            <p style='color: #000000; margin-top: 33px;'> 
                Hi ${username},<br />
                To help you get started, we've sent you a One-Time Password (OTP) to complete your registration.<br/><br/>
                Your OTP is: <b>${otp}</b>
            </p>
            <p style='margin-top: 25px'>
                <b>TANTAK DIGITAL SOLUTIONS</b><br />
            </p>`;

        try {
            // Create a nodemailer transporter using SMTP
            const transporter = nodemailer.createTransport({
                host: smtpServer,
                port: smtpPort,
                secure: true, // Use true for SSL
                auth: {
                    user: senderEmail,
                    pass: senderPassword,
                },
                tls: {
                    rejectUnauthorized: false // Allow self-signed certificates if needed
                }
            });

            // Create the email options
            const mailOptions = {
                from: senderEmail,
                to: user_email,
                subject: subject,
                html: body,
            };

            // Send the email
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully. Info object:', info);
            resolve({ status: '200', message: 'sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            reject(error);
        }
    });
};

// Function to send OTP email for password reset
crudsObj.sendOtpEmailForgotPass = (user_email, otp) => {
    return new Promise(async (resolve, reject) => {
        const body = `
            <h2 style='color: blue;'>TANTAK DIGITAL SOLUTIONS</h2> 
            <p style='color: #000000; margin-top: 33px;'> 
                Hi!<br />
                Please enter the OTP below to verify your identity and reset your password.<br/><br/>
                Your OTP is: <b>${otp}</b>
            </p>
            <p style='margin-top: 25px'>
                <b>TANTAK DIGITAL SOLUTIONS</b><br />
            </p>`;

        try {
            // Create a nodemailer transporter using SMTP
            const transporter = nodemailer.createTransport({
                host: smtpServer,
                port: smtpPort,
                secure: true, // Use true for SSL
                auth: {
                    user: senderEmail,
                    pass: senderPassword,
                },
                tls: {
                    rejectUnauthorized: false // Allow self-signed certificates if needed
                }
            });

            // Create the email options
            const mailOptions = {
                from: senderEmail,
                to: user_email,
                subject: subject,
                html: body,
            };

            // Send the email
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully. Info object:', info);
            resolve({ status: '200', message: 'sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            reject(error);
        }
    });
};

module.exports = crudsObj;
