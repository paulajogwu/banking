const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    firstname: {
        type: String
      
    },
    lastname: {
        type: String
        
    },
   
 
    email: {
        type: String
    },
   
    phone: {
        type: Number,
     
    },
    password: {
        type: String
    },
    Balance:{
        type: Number
    },
      
    date: {
        type: Date,
        default: Date.now
    }
   
})

module.exports = mongoose.model('Account', UsersSchema)