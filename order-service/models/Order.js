import { Schema, model } from "mongoose";


const OrderSchema = Schema({
    products:[
        {
            name:String,
            description:String,
            price:Number
        }
    ],
    total:{type:Number, required:true}
})

export default model('order', OrderSchema)