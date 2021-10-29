var express = require("express");
const { response } = require("../app");
var router = express.Router();
var userHelper = require("../helpers/user-helpers");

var userBlocked = false;
var signupSuccess = false;

// get home page
router.get("/", verifyLogin, (req, res) => {
  let user = req.session.user;
  res.render("home", { title: "Home Page", user });
});

// verify login
function verifyLogin(req, res, next) {
  if (req.session.userLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
}

/* GET login page. */
router.get("/login", function (req, res) {
  if (req.session.userLoggedIn) {
    res.redirect("/");
  } else {
    res.render("login", {
      title: "Login",
      loginErr: req.session.userLoginErr,
      userBlocked,
    });
    userBlocked = false;
  }
});

router.post("/login", (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      if (response.user.userBlocked) {
        userBlocked = true;
        res.redirect("/login");
      } else {
        req.session.userLoggedIn = true;
        req.session.user = response.user;
        res.redirect("/");
      }
    } else {
      req.session.userLoginErr = "Invalid Username or Password";
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.userLoggedIn = false;
  req.session.user = null;
  res.redirect("/");
});

// get signup page
router.get("/signup", function (req, res) {
  res.render("index", { title: "Signup Page", signupSuccess });
  signupSuccess = false;
});

// add signup datas to mongodb
router.post("/signup", (req, res) => {
  userHelper.addUser(req.body).then((response) => {
    let errorMsg = response.msg;
    if (response.status) {
      console.log(response.msg);
      res.render("index", { errorMsg });
    } else if (req.session.userLoggedIn) {
      res.redirect("/");
    } else {
      res.redirect("/signup");
      signupSuccess = true;
      userBlocked = false;
    }
    // req.session.user = response;
    // res.redirect("login");
  });
});

// block user from admin page
router.post("/block-user/", (req, res) => {
  let blockedId = req.body.id;
  userHelper.blockUser(blockedId).then((data) => {
    if (req.session.userLoggedIn && req.session.user._id === blockedId) {
      delete req.session.userLoggedIn;
    }
    res.json({status: true});
  });
});


// delete user from admin page
router.post("/delete-user/", (req, res) => {
  let userId = req.body.id;
  userHelper.deleteUser(userId).then((data) => {
    if (req.session.userLoggedIn && req.session.user._id === userId) {
      delete req.session.userLoggedIn;
    }
    res.json({status: true})
  });
});


module.exports = router;
