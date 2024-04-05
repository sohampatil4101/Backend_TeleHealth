const mongoose = require('mongoose');
const Schema = mongoose
const DoctorSchema = new mongoose.Schema({

    
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },    
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },


});

const Doctor = mongoose.model('doctor', DoctorSchema);
module.exports = Doctor