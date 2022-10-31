const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/inotebook";

const connectToMongoo = () => {
    mongoose.connect(mongoURI,()=>{
        console.log("connected to mongo successfully!")
    })
};

module.exports=connectToMongoo;