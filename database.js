require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/BankingDB', {
    useNewUrlParser: true,
    useFindAndModify: false
}, err => { 
    if (!err) {
        console.log('DB connection successful')
    } else {
        console.log('Error connecting to DB' + err)
    }
});