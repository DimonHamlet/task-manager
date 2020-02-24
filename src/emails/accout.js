const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dmytro.havrysh@nure.ua',
        subject: 'Thanks for sign up!',
        text: `Welcome to the app, ${name}!`
    })
}

const sendByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dmytro.havrysh@nure.ua',
        subject: 'Bye bye!',
        text: `We are sorry to lose you, ${name}!`
    })
}

module.exports = {
    sendWelcomEmail,
    sendByeEmail
}