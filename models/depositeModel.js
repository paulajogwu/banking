const mongoose = require('mongoose');

const DepositeSchema = new mongoose.Schema({
    phone: {
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

module.exports = mongoose.model('Depositor', DepositeSchema)