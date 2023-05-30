module.exports.isAuthorized = function(req, res, next) {
    if (req.session.userid) {
      return next();
    } else {
      /*var err = new Error('Not authorized! Go back!');
      err.status = 401;
      return next(err);*/
      res.status(302).location('/users/login').end();
    }
  };