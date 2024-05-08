import express from 'express'
import amqp from 'amqplib'
import mongoose from 'mongoose'
import oModel from './models/Order.js'

const app = express()

mongoose.connect('mongodb://localhost:27017/dborders')
 .then(() => {
    console.log('Connected to Mongo')
 })
 .catch(() =>{
    console.log('Not connected to Mongo')
 })

 var connection, channel;
const q1 = 'order-service-queue'
const q2 = 'produit-service-queue'

const connectToRabbitMQ = async ()=>{
    const ch = 'amqp://guest:guest@localhost:5672'
    connection = await amqp.connect(ch)
    channel = await connection.createChannel()
    channel.assertQueue(q1)
    channel.assertQueue(q2)
}


connectToRabbitMQ().then(() => {
    console.log('Connected to Rabbit')

    channel.consume(q1, (data) => {
        const products = JSON.parse(data.content.toString())
        const total = products.reduce((som, p) => som+p.price, 0);

        console.log(total)
        const order = {products, total}

        oModel.create(order).then((o) => {
           channel.sendToQueue(q2, Buffer.from(JSON.stringify(o)))
        }
    )
        channel.ack(data);
    })
}).catch(() => {
    console.log('Not connected to Rabbit')
})

app.listen(3001, (err) => {
    if (err)
        console.log('Unable to start server at 3001')
    else
        console.log('Server started at 3001')
})