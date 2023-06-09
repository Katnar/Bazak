const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const screenSchema = new mongoose.Schema({
    name: { type: String },
    screenid: { type: String, unique: true },
    lastvisit: { type: Date },
    userpersonalnumber: { type: String },
    chartsinline: { type: Number },
    ramamid: { type: ObjectId, ref: 'Ramam' },
}, { timestamps: true });

const Screen = mongoose.model('Screen', screenSchema);

module.exports = Screen;

