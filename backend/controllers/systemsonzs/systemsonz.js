const Systemsonz = require("../../models/systemsonzs/systemsonz");
const mongoose = require('mongoose');

exports.find = (req, res) => {
    Systemsonz.find().sort({index: 1})
    .then((systemsonzs) => res.json(systemsonzs))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
    const systemsonzs = new Systemsonz(req.body);
    systemsonzs.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(data);
    });
  };
  // exports.update = (req, res) => {//not working
  //   const systemsonz = new Systemsonz(req.body);
  //   Systemsonz.updateOne(systemsonz)
  //     .then((systemsonzs) => res.json(systemsonzs))
  //     .catch((err) => res.status(400).json("Error: " + err));
  // };

  exports.update = (req, res) => {
    Systemsonz.findOneAndUpdate({id: req.params.id}, req.body)
      .then((systemsonz) => res.json(systemsonz))
      .catch((err) => res.status(400).json("Error: " + err));
  }

  exports.findByCarNumber = (req, res) => {
    Systemsonz.find({ carnumber: req.params.carnumber })
    .then((systemsonzs) => res.json(systemsonzs))
    .catch((err) => res.status(400).json("Error: " + err));
  };
  
  exports.remove = (req, res) => {
    Systemsonz.deleteOne({ _id: req.params.id })
      .then((systemsonzs) => res.json(systemsonzs))
      .catch((err) => res.status(400).json("Error: " + err));
  };

  exports.findById = async(req, res) => {
    const systemsonzs = await Systemsonz.findOne().where({_id:req.params.id})
    
    if(!systemsonzs){
        res.status(500).json({success: false})
    }
    res.send(systemsonzs)
    
   }