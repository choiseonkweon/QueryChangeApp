var express = require('express')
const { restart } = require('nodemon')
var router = express.Router()
var path = require('path')
var HelloWorld = require('./sample/HelloWorld.js')
const data = require("./../data/data.js");

console.log(data)

router.get('/', function (req, res) { 
    res.sendFile(path.join(__dirname, "../public/main.html"));
}) 
router.get('/list', function (req, res) {
    res.readFile( __dirname + "./../data/" + "data.js", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });
 })



router.use('/create', HelloWorld) 



module.exports = router;