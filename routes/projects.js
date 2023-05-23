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
    res.redirect("/projects/all")
  })
  .catch(err => {
    console.log(err.message);
    res.status(400).send("Unable to save to database");
  });
});

router.get('/all', async(req, res) => {

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


router.get('/:id', async(req, res) => {
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


/*project.update({
  project_name : name,
  project_description : badge,
  project_tasks : dob,
  project_start_date : isloved
  project_end_date:*/

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


module.exports = router;

    /*const updatedProject = new Project(req.body);
    var project_name = req.body.project_name;
    var project_description = req.body.project_description;
    var project_tasks = req.body.project_tasks;
    var project_price = req.body.project_price;
    var project_start_date = req.body.project_start_date;
    var project_end_date = req.body.project_end_date;
    
    var currentProject = await Project.findById(id);
    currentProject.project_name = project_name;
    currentProject.project_description = project_description;
    currentProject.project_tasks = project_tasks;
    currentProject.project_price = project_price;
    currentProject.project_start_date = project_start_date;
    currentProject.project_end_date = project_end_date;
    await currentProject.save() */