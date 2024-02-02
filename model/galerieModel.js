const mongoose = require("mongoose");
const galerischema = new mongoose.Schema({
  images: {
    type: String,
  },

  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Galerie = mongoose.model("Galerie", galerischema);
module.exports = Galerie;
