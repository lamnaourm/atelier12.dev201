import express from 'express'
import amqp from 'amqplib'
import PModel from '../models/Product.js'

const routes = express.Router()

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
}).catch(() => {
    console.log('Not connected to Rabbit')
})

routes.post('/', (req, res) => {

    const product = req.body;

    PModel.create(product)
    .then((p) => {
        res.json(p)
    })
    .catch((e) => {
        res.status(510).send(e)
    })

})

routes.post('/buy', (req, res) => {
    const ids = req.body

    PModel.find({_id:{$in:ids}}).then((produits) =>{
        channel.sendToQueue(q1, Buffer.from(JSON.stringify(produits)))
        res.end()
    })
})

export default routes