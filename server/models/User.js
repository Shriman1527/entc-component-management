import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:String ,
    email:{type:String, unique:true},
    password:String ,
    role:{type:String , enum:["admin","student"], default:"student"},
    rollNo: {
    type: String,
    required: function () {
      return this.role === "student"
    },

   }


},{timestamps:true});


export default mongoose.model("User",userSchema);
