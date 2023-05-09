const SystemsToMakat = require("../../models/systemstomakats/systemstomakat");

exports.findById = async(req, res) => {
  const systemstomakat = await SystemsToMakat.findOne().where({_id:req.params.id})
  
  if(!systemstomakat){
      res.status(500).json({success: false})
  }
  res.send(systemstomakat)
  
 }

 exports.findByMakatId = (req, res) => {
    SystemsToMakat.find({ makatId: req.params.makatId })
    .then((systemstomakat) => res.json(systemstomakat))
    .catch((err) => res.status(400).json("Error: " + err));
  };


exports.find = (req, res) => {
    SystemsToMakat.find().sort({index: 1})
    .then((systemstomakats) => res.json(systemstomakats))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const systemstomakat = new SystemsToMakat(req.body);
  systemstomakat.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};
exports.update = (req, res) => {
  const systemstomakat = new SystemsToMakat(req.body);
  SystemsToMakat.updateOne(systemstomakat)
    .then((systemstomakats) => res.json(systemstomakats))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.remove = (req, res) => {
    SystemsToMakat.deleteOne({ _id: req.params.id })
    .then((systemstomakats) => res.json(systemstomakats))
    .catch((err) => res.status(400).json("Error: " + err));
};