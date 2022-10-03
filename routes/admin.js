var express = require('express');
var router = express.Router();
const middleware = require('../middlewares/authentication-check');
const adminHelpers = require('../helpers/admin-helpers');
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');


// admin Login
router.get('/', (req, res) => {
  res.redirect('/admin/adminLogin');
});

router.get('/adminLogin', middleware.adminLoginUnchecked, (req, res) => {
  res.render('admin/admin-login', { "loginErr": req.session.loginErr, admin: true });
  req.session.loginErr = false;
});

router.post('/adminLogin', (req, res) => {
  adminHelpers.adminLogin(req.body).then((response) => {
    if (response.status) {
      req.session.adminloggedIn = true;
      req.session.admin = response.admin;
      res.redirect('/admin/view-products');
    } else {
      req.session.loginErr = "Incorrect email or Password";
      res.redirect('/admin/adminLogin')
    }
  });
});


// admin Signup
router.get('/adminSignup', middleware.adminLoginUnchecked, (req, res) => {
  res.render('admin/admin-signup', { "signupErr": req.session.signupErr })
  req.session.signupErr = false
})

router.post('/adminSignup', (req, res) => {
  adminHelpers.adminSignUp(req.body).then((resolve) => {
    console.log(resolve)
    if (resolve.data) {
      res.redirect('/admin')
    } else {
      req.session.signupErr = resolve.message;
      res.redirect('/adminSignup');
    }
  })
})


//admin Logout
router.get('/logout', (req, res) => {
  req.session.adminloggedIn=false
  req.session.admin = null
  res.redirect('/admin/adminLogin')
})


// view Products
router.get('/view-products', middleware.adminLoginChecked, function (req, res, next) {
  productHelpers.getAllProducts().then((products) => {
    let admin = req.session.admin;
    res.render('admin/view-products', { admin: true, products, admin });
  })
});


// add Products
router.get('/add-product', middleware.adminLoginChecked, (req, res) => {
  res.render('admin/add-product', { admin: true })
})

router.post("/add-product", (req, res) => {
  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.image;
    image.mv('./public/product-images/' + id + '.jpg', (err) => {
      if (!err) {
        res.render('admin/add-product');
      }
    });
  });
})


// delete Product
router.get('/delete-product/:id', (req, res) => {
  let prodId = req.params.id
  productHelpers.deleteProduct(prodId).then((response) => {
    res.redirect('/admin/')
  })
})


// view Users
router.get('/view-users', middleware.adminLoginChecked, (req, res) => {
  userHelpers.getAllUsers().then((userData) => {
    res.render('admin/view-users', { admin: true, userData })

  })
})


// add User
router.get('/add-user', middleware.adminLoginChecked, (req, res) => {
  res.render('admin/add-user', { "signupErr": req.session.signupErr })
  req.session.signupErr = false
})

router.post('/add-user', (req, res) => {
  userHelpers.doSignUp(req.body).then((resolve) => {
    console.log(resolve)
    if (resolve.data) {
      res.redirect('/admin/view-users')
    } else {
      req.session.signupErr = resolve.message;
      res.redirect('/admin/add-user');
    }
  })
})


// delete User
router.get('/delete-user/:id', (req, res) => {
  let userId = req.params.id
  userHelpers.deleteUser(userId).then((response) => {
    res.redirect('/admin/view-users')
  })
})


// edit User
router.get('/edit-user/:id', (req, res) => {
  userHelpers.getUserDetails(req.params.id).then((userData) => {
    res.render('admin/edit-user', { userData, admin: true })
  })
})

router.post('/edit-user/:id', (req, res) => {
  userHelpers.updateUser(req.params.id, req.body).then((response) => {
    console.log(response);
    res.redirect('/admin/view-users')
  })
})


// user Search
router.post('/search',middleware.adminLoginChecked, (req, res) => {
  adminHelpers.searchUser(req.body).then((userData) => {
    console.log(userData);
    if (userData[0]) {
      res.render('admin/search-result', { userData, admin: true })
    } else {
      res.send('<h1>User not found</h1>')
    }
  })
})


module.exports = router;
