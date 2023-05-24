var express = require('express');
var router = express.Router();
const User = require('../models/userModel')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', async(req, res) =>{
  const locals = {
    title : "Registration page"
  }
  res.render("authentification/register", locals);
});

router.post('/register', async(req, res) => {
  const newUser = new User(req.body);
  newUser.save();
  res.json(newUser);
});



module.exports = router;
