const Screen = require("../../models/modularscreens/screen");

exports.read = async (req, res) => {
  const screen = await Screen.findById(req.params.id);
  if (!screen) {
    res.status(500).json({ message: 'המסך לא נמצא' })
  } else {
    res.status(200).send([screen])
  }
}

exports.find = (req, res) => {
  Screen.find()
    .then((screen) => res.json(screen))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.create = (req, res) => {
  const screen = new Screen(req.body);
  screen.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(data);
  });
};

exports.update = (req, res) => {
  Screen.findOneAndUpdate({screenid: req.params.screenId}, req.body)
    .then((candidatepreference) => res.json(candidatepreference))
    .catch((err) => res.status(400).json("Error: " + err));
}

exports.remove = (req, res) => {
  Screen.deleteOne({ screenid: req.params.id })
    .then((screen) => res.json(screen))
    .catch((err) => res.status(400).json("Error: " + err));
};

//

exports.screensbyuserpersonalnumber = (req, res) => {
  Screen.find({ userpersonalnumber: req.params.userpersonalnumber })
    .then((screen) => res.json(screen))
    .catch((err) => res.status(400).json("Error: " + err));
};

//

exports.screenbyscreenid = (req, res) => {
  Screen.find({screenid: req.params.screenid})
    .then((screen) => res.json(screen))
    .catch((err) => res.status(400).json("Error: " + err));
};