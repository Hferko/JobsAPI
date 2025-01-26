const mongoose = require('mongoose')

const JobSchema = mongoose.Schema({
  company:{
    type:String,
    required:[true, 'Adja meg a vállalat nevét'],
    maxlength:50
  },
  position:{
    type:String,
    required:[true, 'Adja meg a pozíciót'],
    maxlength:100
  },
  status:{
    type:String,
    enum:['interview', 'elutasítva', 'függőben'],
    default:'függőben'
  },
  createdBy:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:[true, 'Adja meg a usert'],
  }
}, {timestamps:true})

module.exports = mongoose.model('Job', JobSchema)