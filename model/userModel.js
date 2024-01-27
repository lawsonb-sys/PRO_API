const mongoose = require("mongoose");

userSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "please enter the name"],
  },
  prenom: {
    type: String,
    require: [true, "please enter the prenom"],
  },
  email: {
    type: String,
    require: [true, "please enter the email"],
  },
  image: {
    type: String,
    require: false,
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
