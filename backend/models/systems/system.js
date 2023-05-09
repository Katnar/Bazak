const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const systemSchema = new mongoose.Schema({
    name:{type:String},
    mashbit:{type:Boolean},
});

const System = mongoose.model('System', systemSchema);

module.exports = System;