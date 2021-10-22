var express = require("express");
const { response } = require("../app");
var router = express.Router();
var userHelper = require("../helpers/user-helpers");

// get home page
router.get("/", verifyLogin, (req, res, next) => {
  let user = req.session.user;
  res.render("home", { title: "Home Page", user });
});

// verify login
function verifyLogin(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
}

/* GET login page. */
router.get("/login", function (req, res) {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("login", { title: "Login", loginErr: req.session.loginErr });
  }
});

router.post("/login", (req, res, next) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      req.session.loginErr = "Invalid Username or Password";
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// get signup page
router.get("/signup", function (req, res, next) {
  res.render("index", { title: "Signup Page" });
});

// add signup datas to mongodb
router.post("/signup", (req, res) => {
  userHelper.addUser(req.body).then((response) => {
    console.log(response);
  });
  res.redirect("/");
});

module.exports = router;
