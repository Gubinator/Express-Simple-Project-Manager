var express = require('express');
var router = express.Router();
const Project = require('../models/projectModel');
var auth = require('../middleware/auth');
var Archive = require('../models/archiveModel');
var User = require('../models/userModel');

router.get('/', auth.isAuthorized, async(req, res) => {
  var otherUsers = await User.find().where('name').ne(req.session.userid);
  const locals = {
    title: "Express",
    primjer: "Primjer",
    users : otherUsers
  }
  res.render('projects/index', locals );
});

//Project.collection.drop();
//Archive.collection.drop();

router.post('/add', auth.isAuthorized, async(req, res) => {
  
  var addedMembers = req.body.project_members;
  var projectData = new Project(req.body);
  projectData.project_user_id = req.session.userid;
  await projectData.save();
  if(req.body.project_is_archived=="true"){
    var addArchiveLead = new Archive({
      project_name : req.body.project_name,
      project_member_name : req.session.userid,
      project_member_type : "leader"
    });
    await addArchiveLead.save();
    if(addedMembers){
      if(Array.isArray(addedMembers)){
        addedMembers.forEach(element => {
          var addArchiveMember = new Archive({
            project_name : req.body.project_name,
            project_member_name : element,
            project_member_type : "member"
          })
          addArchiveMember.save();
        });
      } else {
        var addArchiveMember = new Archive({
          project_name : req.body.project_name,
          project_member_name : addedMembers,
          project_member_type : "member"
        })
        addArchiveMember.save();
      }
    }
  } 
    res.redirect("/projects/all")
});

router.get('/all', auth.isAuthorized, async(req, res) => {
  try {

    const username = req.session.userid;
    // All projects concerning user
    const projects = await Project.find({project_user_id : username });
    const memberProjects = await Project.find({project_members : username })
    res.format({
      html: function() {
        res.render('projects/all', {
          titleLeader: 'All projects - leader',
          titleMember: 'All projects - member',
          projects: projects,
          memberProjects : memberProjects
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
    const projectMembers = project.project_members;
    const projectOwner = await User.find({name : project.project_user_id});
    projectMembers.push(projectOwner[0].name);
    const otherMembers = await User.find({}).where("name").nin(projectMembers);
    const role = projectOwner[0].name == req.session.userid ? "leader" : "member"; 

    res.format({
      html: function() {
        res.render('projects/show', {
          title : 'Project '+project.project_name,
          project : project,
          members : otherMembers ,
          role : role
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
  if(req.body.projectMembers!=null){
    let id = req.params.id;
    let member = req.body.project_members;
    let currentProject = await Project.findById(id);
    currentProject.project_members.push(member);
    currentProject.save();
    res.redirect('/projects/'+id);
  }
})





module.exports = router;

