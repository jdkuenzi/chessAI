var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Tetonor', error: req.body.err });
// });

router.get('/', (req, res, next) => {
    res.send({ response: "Hello World !" });
});

module.exports = router;
