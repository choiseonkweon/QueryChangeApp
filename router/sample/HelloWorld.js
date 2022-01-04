var express = require('express')
var router = express.Router()

router.get('/', function(req, res){
    res.render('helloSample.ejs');
})

router.post('/', function (req, res) {
    res.render('helloSample.ejs')
})

router.get('/change', function(req, res){
    res.render('change.ejs');
})

module.exports = router;