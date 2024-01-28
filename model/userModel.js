const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

userSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "please enter the name"],
  },
  prenom: {
    type: String,
    require: [true, "please enter the prenom"],
  },
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    match: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
    trim: true,
  },
  work: {
    type: String,
    require: true,
  },
  ville: {
    type: String,
    require: true,
  },
  numero: {
    type: Number,
    require: true,
  },
  image: {
    type: String,
    require: false,
  },
  galerie: [
    {
      url: {
        type: String,
      },
    },
  ],
});
userSchema.pre("save", async function (nexts) {
  try {
    if (this.isModified("password") || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hashSync(this.password, salt);
    }
  } catch (error) {
    nexts(error);
  }
});
const User = mongoose.model("User", userSchema);

module.exports = User;
