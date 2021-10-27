var db = require("../config/connection");
var collections = require("../config/constants");
const bcrypt = require("bcrypt");
var objectId = require("mongodb").ObjectId;
const { response } = require("express");

module.exports = {
  // Add user data to Database
  addUser: (userData) => {
    return new Promise(async (resolve, reject) => {
      let userEmail = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .findOne({ email: userData.email });
      if (userData.email === userEmail?.email) {
        resolve({ status: true, msg: "User with this Email already exist" });
      } else if (userData.name === userEmail?.name) {
        resolve({ status: true, msg: "User with this username already exist" });
      } else {
        userData.pwd = await bcrypt.hash(userData.pwd, 10);
        userData.date = new Date();
        db.get()
          .collection(collections.USER_COLLECTION)
          .insertOne(userData)
          .then((data) => {
            resolve({ status: false });
          });
      }
    });
  },

  // get all user data to show on admin page
  getUsers: () => {
    return new Promise(async (resolve, reject) => {
      let users = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .find()
        .toArray();

      resolve(users);
    });
  },

  // checking login details on database and encrypt password
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let user = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .findOne({ email: userData.email });
      if (user) {
        bcrypt.compare(userData.pwd, user.pwd).then((status) => {
          if (status) {
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("Login failed");
            resolve({ status: false });
          }
        });
      } else {
        console.log("User not found");
        resolve({ status: false });
      }
    });
  },

  // Delete user from database in admin page
  deleteUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER_COLLECTION)
        .deleteOne({ _id: objectId(userId) })
        .then((data) => {
          // console.log(response);
          resolve(data);
        });
    });
  },

  // block user from admin page
  blockUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER_COLLECTION)
        .updateOne({ _id: objectId(userId) }, { $set: { userBlocked: true } })
        .then((data) => {
          console.log(response);
          resolve(data);
        });
    });
  },

  // unblock user from admin page
  unblockUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER_COLLECTION)
        .updateOne({ _id: objectId(userId) }, { $unset: { userBlocked: "" } })
        .then((data) => {
          // console.log(response);
          resolve(data);
        });
    });
  },

  // get single user details to show on edit user form
  getSingleUserDetails: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER_COLLECTION)
        .findOne({ _id: objectId(userId) })
        .then((userData) => { 
          console.log(userData)  /* Get user data of the editing user */
          resolve(userData);
        });
    });
  },

  // update edited user data on database
  updateUserDetails: (userId, userDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USER_COLLECTION)
        .updateOne(
          { _id: objectId(userId) },
          {
            $set: {
              name: userDetails.name,
              email: userDetails.email,
            },
          }
        )
        .then((userData) => {
          resolve();
        });
    });
  },
};
