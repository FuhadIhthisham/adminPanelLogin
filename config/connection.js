const mongoClient = require('mongodb').MongoClient

const state = {
    db: null
}

module.exports.connect = (done)=>{
    const url = 'mongodb://localhost:27017'
    const dbname = 'accounts'

    mongoClient.connect(url,(err,data)=>{
    if(err){
      return done(err);
    }
    state.db = data.db(dbname)
    done()
    
    // else{
    //   client.db(dbname).collection('users').insertOne(req.body)
    // }
  })

}

module.exports.get = ()=>{
    return state.db
}