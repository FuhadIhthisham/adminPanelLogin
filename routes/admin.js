var express = require("express");
var router = express.Router();
var userHelpers = require("../helpers/user-helpers");

/* GET users listing. */
router.get("/", function (req, res, next) {
  // get user datas from mongodb

  userHelpers.getUsers().then((user)=>{
    res.render("admin/admin-page", { title: "Admin Panel",admin: true, user });

  })

});


router.get('/delete-user/:id',(req,res)=>{
  let userId = req.params.id

  // check this
  userHelpers.deleteUser(userId).then((data)=>{
    console.log(data);
  }).catch((err)=>{
    console.log(err);
  })
  // check whether giving redirect inside then or outside it
  res.redirect('/admin')
})

module.exports = router;
