const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const systemonzSchema = new mongoose.Schema({
    id:{type:String},
    carnumber:{type:String},
    kshirot:{type:String},
    mkabaz:{type:String},
    takala_info: { type: String },
    expected_repair: { type: String },
    systemType:{type:String},
}, { timestamps: true });

const SystemsOnZ= mongoose.model('SystemsOnZ', systemonzSchema);

module.exports = SystemsOnZ;