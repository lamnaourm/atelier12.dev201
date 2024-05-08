import express from 'express'
import mongoose from 'mongoose'
import ProductRoute from './routes/product.js'

const app = express()
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/dbproducts')
 .then(() => {
    console.log('Connected to Mongo')
 })
 .catch(() =>{
    console.log('Not connected to Mongo')
 })

 app.use('/products', ProductRoute);
 
app.listen(3000, (err) => {
    if (err)
        console.log('Unable to start server at 3000')
    else
        console.log('Server started at 3000')
})