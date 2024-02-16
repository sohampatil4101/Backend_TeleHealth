const mongoose = require('mongoose');
const {Schema} = mongoose

const docSchema = new mongoose.Schema({
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
    },  
    specialization:{
        type: String,
        required: true
    },
    yrofgraduation:{
        type: String,
        required: true,
    },
    experience:{  //yes or no
        type: String,
        required: true
    },
    type:{  //gov or private
        type: String,
        required: true
    },
    govno:{  
        type: String,
        required: false
    },
    date:{
        type: Date,
        default: Date.now
    },


});
module.exports = mongoose.model('docinfo', docSchema);   
