var express = require('express');
var Archive = require('../models/archiveModel');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  const locals = {
    title: "Project manager",
    session : req.session
  }
  res.render('index', locals );
});

router.get('/archive', async(req, res) => {
  try{
    let everythingArchived = await Archive.find({});
    res.render('archive', {
      everythingArchived : everythingArchived,
      title : "Project archive"
    }
    );
  } catch(err){
    res.json(err)
  }
})

module.exports = router;
