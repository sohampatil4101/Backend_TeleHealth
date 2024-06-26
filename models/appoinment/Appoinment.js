const mongoose = require('mongoose');
const Schema = mongoose
const AppoinmentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
    },
    date:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    customschedule:{
        type: String,
        required: false
    },
    package:{
        type: String,
        required: false
    },
    duration:{
        type: String,
        required: false
    },
    problem:{
        type: String,
        required: false
    },
    meetcode:{
        type: String,
        required: false
    },
    slot:{
        type: String,
        required: false
    },
    days:{
        type: String,
        required: false
    },
    confirm:{
        type: String,
        default:"pending"
    },





});

const Doctor = mongoose.model('appoinment', AppoinmentSchema);
module.exports = Doctor