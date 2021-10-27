const { response } = require("express");
var express = require("express");
var router = express.Router();
var userHelpers = require("../helpers/user-helpers");

// initializing admin username and pass
var adminEmail = "admin@gmail.com";
var adminPass = "12345";
var loginSuccess = false;
var signOut = false;

/* GET users listing. */
router.get("/", verifyLogin, function (req, res, next) {
  admin = req.session.admin;

  // get user datas from mongodb
  userHelpers.getUsers().then((user) => {
    res.render("admin/admin-page", {
      title: "Admin Panel",
      admin,
      adminEmail,
      user,
      loginSuccess,
    }); /* passing admin is login or not*/
  });
});

function verifyLogin(req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  if (req.session.isAdmin) {
    next();
  } else {
    res.render("admin/admin-login");
  }
}

// get admin login page
router.get("/admin-login", (req, res, next) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  if (!req.session.isAdmin) {
    /* if admin is not in session or if session breaks */
    res.render("admin/admin-login", {
      title: "Admin Login",
      adminLoginErr: req.session.adminLoginErr,
      logout: signOut,
    });
    req.session.adminLoginErr = false;
    signOut = false;
  } else {
    res.redirect("/admin");
  }
});

/* get logout page. After clicking logout in admin panel */
router.get("/logout", function (req, res, next) {
  req.session.isAdmin = false;
  req.session.admin = false;
  res.redirect("admin-login");
});

// post admin login datas
router.post("/admin-login", adminVerify, (req, res) => {
  loginSuccess = true;
  console.log("token approved");
  res.redirect("/admin");
});

// verify admin username and pass
function adminVerify(req, res, next) {
  if (
    req.body.adminEmail === adminEmail &&
    req.body.adminPassword === adminPass
  ) {
    console.log("admin verified");
    req.session.isAdmin = true;
  }
  if (req.session.isAdmin) {
    req.session.admin = req.body.adminEmail;
    next();
  } else {
    console.log("Admin verification failed");
    req.session.adminLoginErr = true;
    res.redirect("admin-login");
  }
}

// delete user from admin page
// router.get("/delete-user/:id", (req, res) => {
//   let userId = req.params.id;
//   userHelpers.deleteUser(userId).then((data) => {
//     res.redirect("/admin");
//   });
// });

// block user from admin page
// router.get("/block-user/:id", (req, res) => {
//   let blockedId = req.params.id;
//   userHelpers.blockUser(blockedId).then((data) => {
//     res.redirect("/admin");
//   });
// });

// unblock user from admin page
router.get("/unblock-user/:id", (req, res) => {
  let blockedId = req.params.id;
  userHelpers.unblockUser(blockedId).then((data) => {
    res.redirect("/admin");
  });
});

// get a single user data to edit user page
router.get("/edit-user/:id", async (req, res) => {
  let userDetails = await userHelpers.getSingleUserDetails(req.params.id);
  res.render("admin/edit-user", { userDetails });
});

// post the edited user data to server
router.post("/edit-user/:id", async (req, res) => {
  userHelpers.updateUserDetails(req.params.id, req.body).then((response) => {
    res.redirect("/admin");
  });
});

// Add new user through admin panel

// get add user page
router.get("/add-user", (req, res) => {
  res.render("admin/add-user");
});

// post new user data to database
router.post("/add-user", (req, res) => {
  userHelpers.addUser(req.body).then((response) => {
    
    console.log(response);
    res.redirect("/admin");
  });
});

module.exports = router;
