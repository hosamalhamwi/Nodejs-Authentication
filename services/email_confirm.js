const nodemailer = require("nodemailer");


function email_confirm(email, password, email_to, name,code) {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass: password
        },
    });

    transport.sendMail({
        from: email,
        to: email_to,
        subject: 'NodeJS-Authentication',
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please use ${code} OTP code to confirm your account</p>
        
        </div>`,
    });
}

module.exports = { email_confirm };