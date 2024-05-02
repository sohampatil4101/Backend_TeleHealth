const mongoose = require('mongoose');
const {Schema} = mongoose

const PrescriptionSchema = new mongoose.Schema({
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
    },  
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },  
    title: {
        type: String, 
        required: false
      },
    prescription: {
        type: [String], 
        required: false
      },
    readstatus: {
        type: String, 
        default: "unread",
        required: false
      },
    date:{
        type: Date,
        default: Date.now
    },


});
module.exports = mongoose.model('prescription', PrescriptionSchema);   

