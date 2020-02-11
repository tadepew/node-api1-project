// implement your API here
// step 1: set up express and server

const express = require("express");

const Users = require("./data/db");

const port = 5000;

const server = express();

server.use(express.json());

//GET ALL USERS -- find()
server.get("/api/users", (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

//POST USER -- insert()
server.post("/api/users", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    const newUser = req.body;
    Users.insert(newUser)
      .then(user => {
        res.status(201).json(req.body); //not the whole user document - missing id / created at / updated at
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          errorMessage:
            "There was an error while saving the user to the database"
        });
      });
  }
});

//GET USER BY ID -- findByID()
server.get("/api/users/:id", (req, res) => {
  Users.findById(req.params.id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: "The user information could not be retrieved. "
      });
    });
});

// UPDATE USER -- update()
server.put("/api/users/:id", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else if (!req.params.id) {
    // not working, wrong if statement? (needsFindByID?)
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist" });
  } else {
    const changes = req.body;
    Users.update(req.params.id, changes)
      .then(change => {
        res.status(200).json(changes); //missing created at / updated at
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          errorMessage: "The user information could not be modified."
        });
      });
  }
});

//DELETE USER -- delete()
server.delete("/api/users/:id", (req, res) => {
  if (!req.params.id) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist" });
  } else {
    Users.remove(req.params.id)
      .then(removed => {
        res.status(200).json(removed); // incorrect id of who was removed (needs findById)
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: "Error" });
      });
  }
});

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
