import express from 'express'
import mongoose from 'mongoose'

const app = express()

mongoose.connect('mongodb://localhost:27017/dborders')
 .then(() => {
    console.log('Connected to Mongo')
 })
 .catch(() =>{
    console.log('Not connected to Mongo')
 })

app.listen(3001, (err) => {
    if (err)
        console.log('Unable to start server at 3001')
    else
        console.log('Server started at 3001')
})