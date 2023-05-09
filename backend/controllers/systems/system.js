const System = require("../../models/systems/system");

exports.findById = async(req, res) => {
  const system = await System.findOne().where({_id:req.params.id})
  
  if(!system){
      res.status(500).json({success: false})
  }
  res.send(system)
  
 }


exports.find = (req, res) => {
    System.find().sort({index: 1})
    .then((systems) => res.json(systems))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const system = new System(req.body);
  system.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};
exports.update = (req, res) => {
  const system = new System(req.body);
  System.updateOne(system)
    .then((systems) => res.json(systems))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    System.deleteOne({ _id: req.params.id })
    .then((systems) => res.json(systems))
    .catch((err) => res.status(400).json("Error: " + err));
};