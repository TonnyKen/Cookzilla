module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if (!req.session.uid) {
      req.flash('err', 'Not log in yet');
      return res.redirect('/signup');
    }
    next();
  },

  checkNotLogin: function checkNotLogin(req, res, next) {
    if (req.session.uid) {
      req.flash('err','already logged in');
      return res.redirect('back');
    }
    next();
  }
};
