const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    shortId:{
        type: String,
        required: true,
        unique: true
    },
    redirectedUrl:{
        type: String,
        required: true
    },
    visited:[{timestamp: {type:Number}}],

}, {timestamps:true} );

const URL = mongoose.model("url",urlSchema);
module.exports = URL;