const express = require("express");
const app = express();
const {connectToMongo} = require("./connection")
const urlRoute = require("./routes/route");
const URL = require("./models/model")
const PORT = 8001;
connectToMongo('mongodb://localhost:27017/short-url')
.then(()=>{
    console.log("Connected to MongoDb");
});

app.use(express.json());
app.use("/url",urlRoute);

app.listen(PORT, ()=>{
    console.log(`Server started at port ${PORT}`);
});