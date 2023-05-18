var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const locals = {
    title: "Express",
    primjer: "Primjer"
  }
  res.render('index', locals );
});

module.exports = router;
