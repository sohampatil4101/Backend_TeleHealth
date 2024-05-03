const mongoose = require('mongoose');
const {Schema} = mongoose

const PermissionSchema = new mongoose.Schema({
    ehr:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ehr',
    },  
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },  
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },  
    date:{
        type: Date,
        default: Date.now
    },


});
module.exports = mongoose.model('permission', PermissionSchema);   

