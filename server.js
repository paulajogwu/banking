const express = require('express');
const app = express();
const  bodyParser = require('body-parser');
const session = require('express-session')

var cors = require('cors')

// import config
const db = require('./database');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())



app.use(express.static(__dirname + '/public'));




app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});
// custom 500 page 
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});


app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App listening at  http://localhost:" + port);

});