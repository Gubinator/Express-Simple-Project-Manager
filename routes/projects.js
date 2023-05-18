var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const locals = {
    title: "Express",
    primjer: "Primjer"
  }
  res.render('projects', locals );
});

const Project = require('../models/projectModel')

router.post('/projects' , async(req, res) => {
  try {
    const project = await Project.create(req.body)
    res.status(200).json(project);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: error.message})
  }
})

router.get('/projects', async(req, res) => {
  try {
    const projects = await Project.find({});
  } catch (error) {
    res.status(500).json({message: error.message})
  }
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