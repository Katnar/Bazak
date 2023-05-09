const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema


const systemstomakatSchema = new mongoose.Schema({
    makatId:{type:String},
    systemId:{type:String},
});

const SystemsToMakat = mongoose.model('SystemsToMakat', systemstomakatSchema);

module.exports = SystemsToMakat;