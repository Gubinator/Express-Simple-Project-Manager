var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const locals = {
    title: "Express",
    primjer: "Primjer"
  }
  res.render('projects/index', locals );
});

const Project = require('../models/projectModel')

router.post('/add' , async(req, res) => {

  var projectData = new Project(req.body);
  projectData.save().then(item=>{
    res.send("Item saved to the database");
  })
  .catch(err => {
    console.log(err.message);
    res.status(400).send("Unable to save to database");
  });
});

router.get('/all', async(req, res) => {
  const locals = {
    title: "Express",
    primjer: "Primjer"
  }
  try {
    const projects = await Project.find({});
  } catch (error) {
    res.status(500).json({message: error.message})
  }
  res.render('projects/all', locals );
})

router.get('/projects/:id', async(req, res) => {
  try {
    const {id} = req.params;
    const project = await Project.find(id);
  } catch (error) {
    res.setMaxListeners(500).json({message: error.message})
  }
})

module.exports = router;