// implement your API here
// step 1: set up express and server

const express = require("express");

const db = require("./data/db");

const port = 5000;

const server = express();

server.use(express.json());
server.use(cors());

//GET
server.get("/", (req, res) => {
  res.json({ message: "Server running on port", port });
});

//GET ALL USERS -- find()
server.get("/api/users", (req, res) => {
  db.find()
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
  const newUser = req.body;
  if (!newUser.name || !newUser.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.insert(newUser)
      .then(user => {
        res.status(201).json(newUser); //not the whole user document - missing id / created at / updated at
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
  db.findById(req.params.id)
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
  } else {
    const { id } = req.params;
    db.findById(id)
      .then(user => {
        if (!user) {
          res
            .status(404)
            .json({ message: "The user with the specified ID does not exist" });
        } else {
          db.update(id, req.body)
            .then(change => {
              res.status(200).json(user); //returns whole user info because of findById
            })
            .catch(err => {
              res.status(500).json({
                message: "The user information could not be modified."
              });
            });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: "The user information could not be retrieved" });
      });
  }
});

//DELETE USER -- delete()
server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  //check to see if user exists
  db.findById(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });

        //user exists -- delete
      } else {
        db.remove(id)
          .then(data => {
            res.status(200).json(user); //info of deleted user
          })
          .catch(err => {
            res
              .status(500)
              .json({ errorMessage: "The information could not be retrieved" });
          });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "The information could not be retrieved" });
    });
});

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
