var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  console.log('Currently get /logout... ');
  req.session.uid = null;
  res.redirect('/signup');
});

module.exports = router;
