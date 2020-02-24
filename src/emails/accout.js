const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

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