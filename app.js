var express = require('express')
var app = express()
var router = require('./router/index.js') 

app.listen(3000, function () {
    console.log("start!! express server on port 5000")
});

app.use(express.static('public'))


app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)
app.use(router)


 module.exports = app;