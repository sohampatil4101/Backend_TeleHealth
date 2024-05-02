const mongoose = require('mongoose');
const {Schema} = mongoose

const EhrSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },  
    title: {
        type: String, 
        required: false
      },
    ehr: {
        type: String, 
        required: false
      },
    permission: {
        type: String, 
        default: "private",
        required: false
      },
    date:{
        type: Date,
        default: Date.now
    },


});
module.exports = mongoose.model('ehr', EhrSchema);   

