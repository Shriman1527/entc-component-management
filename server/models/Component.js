import mongoose, { model } from "mongoose";

const componentSchema= new mongoose.Schema({
    name:String,
    category:String,
    quantityAvailable:Number,
    totalQuantity:Number,
    description:String,
    location:String,

},{timestamp:true});

export default mongoose.model("Component", componentSchema);