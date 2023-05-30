var express = require('express');
var router = express.Router();
const Project = require('../models/projectModel');
var auth = require('../middleware/auth');

router.get('/', auth.isAuthorized, async(req, res) => {
  const locals = {
    title: "Express",
    primjer: "Primjer"
  }
  res.render('projects/index', locals );
});



router.post('/add', async(req, res) => {

  var projectData = new Project(req.body);
  projectData.save().then(item=>{ 
    res.redirect("/projects/all")
  })
  .catch(err => {
    console.log(err.message);
    res.status(400).send("Unable to save to database");
  });
});

router.get('/all', auth.isAuthorized, async(req, res) => {

  try {
    const projects = await Project.find({});
    res.format({
      html: function() {
        res.render('projects/all', {
          title: 'All projects',
          projects: projects
        });
      },
      json: function() {
        res.json(projects);
      }
    });
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})


router.get('/:id', auth.isAuthorized, async(req, res) => {
  try {
    const {id} = req.params;
    const project = await Project.findById(id);

    res.format({
      html: function() {
        res.render('projects/show', {
          title: 'Project '+project.project_name,
          project: project
        });
      },
      json: function() {
        res.json(project);
      }
    });
  } catch (error) {
    res.setMaxListeners(500).json({message: error.message});
  }
})

router.all('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if(!project){
      return res.status(404).json({message: "Cannot find any project with specified ID"})
    }
    res.redirect('/projects/all');
    //res.redirect('/all');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.all('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id : id};
    var pr_name = req.body.project_name;
    var pr_description = req.body.project_description;
    var pr_tasks = req.body.project_tasks;
    var pr_price = req.body.project_price;
    var pr_start_date = req.body.project_start_date;
    var pr_end_date = req.body.project_end_date;
    
    const update = { 
      project_name : pr_name,
      project_description : pr_description,
      project_tasks : pr_tasks,
      project_price : pr_price,
      project_start_date : pr_start_date,
      project_end_date : pr_end_date,
     };

    let doc = await Project.findOneAndUpdate(filter, update);
    res.redirect('back');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add-member/:id', async(req, res) => {
  let id = req.params.id;
  let member = req.body.project_member;
  let currentProject = await Project.findById(id);
  currentProject.project_members.push(member);
  currentProject.save();
  res.redirect('back');
})


module.exports = router;

