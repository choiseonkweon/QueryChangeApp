var express = require('express')
const { restart } = require('nodemon')
var router = express.Router()
var path = require('path')
var HelloWorld = require('./sample/HelloWorld.js')
 
router.get('/', function (req, res) { 
    res.sendFile(path.join(__dirname, "../public/main.html"));
})

router.use('/create', HelloWorld) 


module.exports = router;