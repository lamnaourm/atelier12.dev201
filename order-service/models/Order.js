import { Schema } from "mongoose";


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