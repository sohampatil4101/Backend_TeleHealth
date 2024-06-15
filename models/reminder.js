const mongoose = require('mongoose');
const Schema = mongoose
const RemiderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    medicine:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    }
});

const Doctor = mongoose.model('reminder', RemiderSchema);
module.exports = Doctor