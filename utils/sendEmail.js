const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Function to send email using template
const sendEmail = async (to, subject, template, replacements) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    // Read the HTML template
    const templatePath = path.join(__dirname, 'templates', `${template}.html`);
    let htmlContent = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders in the template
    Object.keys(replacements).forEach(key => {
        htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
