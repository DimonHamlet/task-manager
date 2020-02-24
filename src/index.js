const express = require('express')
const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

sgMail.send({
    to: 'formyblogger69@gmail.com',
    from: 'dmytro.havrysh@nure.ua',
    subject: 'Test mail',
    text: 'Test mail text'
})

app.listen(port, () => {
    console.log('Server is up on port ', port)
})
