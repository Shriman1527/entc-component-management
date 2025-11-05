import mongoose from "mongoose";
import User from './User.js'
import Component from "./Component.js";

const issueSchema=  new mongoose.Schema({
    studentId:{type:mongoose.Schema.ObjectId,ref:User},
    componentId:{type:mongoose.Schema.ObjectId,ref:Component},
    quantityIssued:Number,
    dateIssued:{type:Date,default:Date.now},
    dateReturned:Date,
    status:{type:String,enum:["Issued","Returned"],default:"Issued"},
    issuedBy:{type:mongoose.Schema.ObjectId,ref:User},
},{ timestamp:true});

export default mongoose.model("Issue", issueSchema);

