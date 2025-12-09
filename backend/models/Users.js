const mongoose =require('mongoose')

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:['doctor','patient']
    }
},{timestamps:true})

module.exports=mongoose.model('User',schema)
