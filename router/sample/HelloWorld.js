var express = require('express')
var router = express.Router()
router.use(express.static('data'))

router.get('/', function(req, res){
    res.render('helloSample.ejs');
})

router.get('/change', function(req, res){
    let param = {
        title: 'Hellow World',
        data : 'test_data',
    }
    res.render('change.ejs',param);
})



module.exports = router;