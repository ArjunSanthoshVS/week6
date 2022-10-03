
var express = require('express');
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers')
const middleware = require('../middlewares/authentication-check')
var router = express.Router();


/* GET home page. */
router.get('/',(req, res, next) => {
  let user = req.session.user;
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-products', { products, user: true, user });
  })
});


// Signup page
router.get('/signup', middleware.loginUnchecked, (req, res) => {
  res.render('user/signup', { "signupErr": req.session.signupErr });
  req.session.signupErr = false;
});

router.post('/signup', (req, res) => {
  userHelpers.doSignUp(req.body).then((resolve) => {
    console.log(resolve)
    if (resolve.data) {
      res.redirect('/login')
    } else {
      req.session.signupErr = resolve.message;
      res.redirect('/signup');
    }
  })
})



// Login page
router.get('/login', middleware.loginUnchecked, (req, res) => {
  if(req.session.loggedIn){
    res.redirect('/login')
  }else{
    res.render('user/login', { "loginErr": req.session.loginErr });
    req.session.loginErr = false;
  }
});

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect('/');
    } else {
      req.session.loginErr = "Incorrect email or Password";
      res.redirect('/login')
    }
  });
});


// Logout
router.get('/logout', (req, res) => {
  req.session.loggedIn=false
  req.session.user = null
  res.redirect('/login');
})


module.exports = router;
  