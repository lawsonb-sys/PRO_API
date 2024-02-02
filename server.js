const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require("bcrypt");
const User = require("./model/userModel");
const Galerie = require("./model/galerieModel");
const uploads = require("./middleware/upload");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
//routes pour les utilisateur
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
//enregistre l'utilisateur
app.post("/users/register", async (req, res) => {
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
//connecter un utilisateur
app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    //verifier si l'utilisateur est dans la base
    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable" });
    }
    //comparer les password
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json(user);
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

//les routes de la galerie ...........................................................................

//GET
app.get("/galeries", async (req, res) => {
  try {
    const galeries = await Galerie.find({});
    res.status(200).json({ galeries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//afficher les images d'un utilisateur
app.get("/galeries/:userid", async (req, res) => {
  try {
    const id = req.params.id;
    const userid = req.params.userid;
    const Imgs = await Galerie.find();
    const reponse = [];
    Imgs.forEach(async (element) => {
      if (element.userid == userid) {
        await reponse.push(element);
      }
    });
    res.status(200).json(reponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//POST ajouter des images a la base de donne
app.post("/galeries", uploads.array("images"), async (req, res) => {
  try {
    let image = await Galerie.create(req.body);
    const files = req.files;
    for (const file of files) {
      image.images = file.path;
    }
    image.save();
    res.status(200).json(image);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
//modifier une image
app.put("/galeries/:id", uploads.single("images"), async (req, res) => {
  try {
    const id = req.params.id;
    const image = await Galerie.findById(id);
    if (!image) {
      return res.status(404).send("Image not found");
    }
    image.images = req.body.images;
    if (req.file) {
      image.images = req.file.path;
    }
    await image.save();
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//suprimer une image grace a son ID
app.delete("/galeries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Galerie.findByIdAndDelete(id);
    if (!image) {
      return res.status(404).send("image not found");
    }
    const imagepth = image.images;
    fs.unlink(imagepth, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "error deleting" });
      }
    });

    res.status(200).send("Images suprimé avec succè");
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
