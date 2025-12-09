const mongoose =require('mongoose')

const schema=new mongoose.Schema({
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    slot:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['Pending','Approved','Rejected'],
        default:'Pending'
    }
},{timestamps:true})

module.exports=mongoose.model('Appointment',schema)
