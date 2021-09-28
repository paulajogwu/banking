const mongoose = require('mongoose');

const TransferSchema = new mongoose.Schema({
    sender: {
        type: String,
       
    },
    receiver: {
        type: String,
       
    },
   
    amount: {
        type: String,
        
    },
   
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Transfer', TransferSchema)