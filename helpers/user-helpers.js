var db = require("../config/connection");
var collections = require("../config/constants");
const bcrypt = require('bcrypt')
var objectId = require('mongodb').ObjectId

module.exports = {
  addUser: (userData) => {

    return new Promise(async(resolve,reject)=>{
        userData.pwd = await bcrypt.hash(userData.pwd,10)
        userData.date = new Date()
        db.get()
          .collection(collections.USER_COLLECTION)
          .insertOne(userData)
          .then((data) => {
           resolve(data)
          });
    })
    
  },

  getUsers: () => {
    return new Promise(async (resolve, reject) => {
      let users = await db
        .get()
        .collection(collections.USER_COLLECTION)
        .find()
        .toArray();

        resolve(users)
    });
  },

  doLogin: (userData)=>{
    return new Promise(async(resolve,reject)=>{
        let loginStatus = false
        let response = {}
        let user = await db.get().collection(collections.USER_COLLECTION).findOne({email: userData.email})
        if(user){
            bcrypt.compare(userData.pwd,user.pwd).then((status)=>{
                if(status){
                    console.log("Login success");
                    response.user = user
                    response.status = true
                    resolve(response)
                }else{
                    console.log("Login failed");
                    resolve({status:false})
                }
            })
        }
        else{
            console.log("User not found");
            resolve({status:false})
        }
    })
  },
  deleteUser: (userId)=>{
    return new Promise((reject,resolve)=>{
        db.get().collection(collections.USER_COLLECTION).deleteOne({_id: objectId(userId)}).then((data)=>{
            // console.log(response);
            resolve(data)
        })
    })
  }
};
