const mongoose = require('mongoose');
const {Schema} = mongoose

const EhrSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },  
    ehr: {
        type: String, 
        required: false
      },
    date:{
        type: Date,
        default: Date.now
    },


});
module.exports = mongoose.model('ehr', EhrSchema);   

