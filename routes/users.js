require('dotenv').config(); 
var express = require('express');
var router = express.Router();
const User = require('../models/userModel')
const bcrypt = require('bcrypt');
const Project = require('../models/projectModel');
const uuidv4 = require('uuid').v4;
router.use(express.json());
var auth = require('../middleware/auth');


//User.collection.drop();


router.get('/', function(req, res, next) {
    res.send(req.session.userid);
});

router.get('/s', function(req, res, next){
  res.send(req.session);
})

router.get('/register', async(req, res) =>{
  const locals = {
    title : "Registration page",
  }
  res.render("authentification/register", locals);
});

router.get('/login', async(req, res) => {
  const locals = {
    title : "Login page"
  }
  res.render("authentification/login", locals);
})

router.post('/register', async(req, res) => {
  if(req.body.password == req.body.password_confirm)
  {
    try{
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      console.log("Password: " + req.body.password + " Hashed pass: " + hashedPassword )
      const newUser = new User({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword
      });

      newUser.save();
      res.redirect('login');
    } catch(error) {
      res.status(500).json({message: error.message})
    }
  } else{
    res.redirect('back');
  } 
});


router.post('/login', async(req, res) => {
 try{
    const selectedUser = await User.find({email : req.body.email});
    // Because JSON that I get back is in format like this;  [{...}]  hence [0]
    const encryptedPassword = selectedUser[0].password;
    const username = selectedUser[0].name;
    // No elements in array means that user is not created
    if(selectedUser.length==0){
      res.send("There is no registered user with that email.");
    } else{
      if(await bcrypt.compare(req.body.password, encryptedPassword)){
        session=req.session;
        session.userid=username;
        res.redirect('/projects');
      }
      res.send("Password does not match, try again!");
    }
  } catch {
    res.send("There is no user in database with specified email.");
  }
})

router.all('/logout', auth.isAuthorized, async(req, res) => {
  try{
    req.session.destroy();
    res.redirect('/users/login')
  } catch(err) {
    res.send(err);
  }
})

module.exports = router;
