const express = require("express");
const mongoose = require("mongoose");
const User = require("./model/userModel");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//routes
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { email } = req.body;
    const exist = await User.findOne({ email });
    if (exist) {
      res.status(409).json({ message: "user already existe" });
      return;
    } else {
      const user = await User.create(req.body);
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
      return res
        .status(404)
        .json({ message: `cannot find any person with ID ${id}` });
    }
    const updateuser = await User.findById(id);
    res.status(200).json(updateuser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//reomve
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: `cannot find and delete any person with ID ${id}` });
    }
    res.send("utilisateur supreimer avec succè");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.bolcfp7.mongodb.net/proletariadb?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connecte to mongodb");
    app.listen(3000, () => {
      console.log(`API is running on port 3000`);
    });
  })
  .catch((eror) => {
    console.log(eror);
  });
