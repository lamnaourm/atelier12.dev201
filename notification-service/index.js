import express from 'express'
import amqp from 'amqplib'
import nodemailer from 'nodemailer'

const app = express()

var connection, channel;
const q3 = 'notification-service-queue'

const connectToRabbitMQ = async () => {
    const ch = 'amqp://guest:guest@localhost:5672'
    connection = await amqp.connect(ch)
    channel = await connection.createChannel()
    channel.assertQueue(q3)
}

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mohammed.lamnaour@gmail.com',
        pass: 'iijmrgpgvsvevlow'
    }
});

connectToRabbitMQ().then(() => {
    console.log('Connected to Rabbit')

    channel.consume(q3, (data) => {
        const order = JSON.parse(data.content.toString())

        var mailOptions = {
            from: 'mohammed.lamnaour@gmail.com',
            to: 'mohammed.lamnaour@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!' + data.content.toString()
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        channel.ack(data);
    })
}).catch(() => {
    console.log('Not connected to Rabbit')
})

app.listen(3002, (err) => {
    if (err)
        console.log('Unable to start server at 3001')
    else
        console.log('Server started at 3001')
})