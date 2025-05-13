const mongoose = require('mongoose');

const DB_URL = process.env.DB_URL

mongoose.connect(DB_URL)
.then(()=>{
    console.log("DataBase is COnnected")
}).catch((err)=>{
    console.log("database is not connected")
})