const express = require('express');
const db = require('../data/db')

const router = express.Router();

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." }).end();
      }
      db.insert({ title, contents }).then(data => {
        db.findById(data.id).then(data => {
          res.status(201).json(data);
        }).catch(error => {
          res.status(500).json({ errorMessage: "Could not get newly created post." }).end();
        });
      }).catch(error => {
        res.status(500).json({ error: "There was an error while saving the post to the database" }).end();
      });
  });
  
  router.post('/:id/comments', (req, res) => {
    const { id } = req.params;
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ errorMessage: "Please provide text for the comment." }).end();
  }
 
  db.findById(id).then(data => {
    if (!data) {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    } else {
      
      db.insertComment({ text }).then(comment => {
    
        db.findCommentById(comment.id).then(newComment => {
          res.status(201).json(newComment);
        }).catch(error => {
          res.status(500).json({ errorMessage: "Could not get newly created comment." }).end();
        });
      }).catch(error => {
        res.status(500).json({ error: "There was an error while saving the comment to the database" }).end();
      });
    }
  }).catch(error => {
    res.status(500).json({ errorMessage: "Could not find user by id." }).end();
  });
  });
  
  router.get('/', (req, res) => {
    db.find().then(data => {
      if (!data) {
        res.status(404).json().end();
      } else {
        res.status(200).json(data);
      }
    }).catch(error => {
      res.status(500).json().end();
    });
  });
  
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id).then(data => {
      if (!data) {
        res.status(404).json().end();
      } else {
        res.status(200).json(data);
      }
    }).catch(error => {
      res.status(500).json().end();
    });
  });
  
  router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    db.findById(id).then(data => {
      if (!data) {
        res.status(404).json().end();
      } else {
        res.status(200).json(data.comments);
      }
    }).catch(error => {
      res.status(500).json().end();
    });
  });
  
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id).then(data => {
      if (!data) {
        res.status(404).json().end();
      } else {
        res.status(200).json(data.comments);
      }
    }).catch(error => {
      res.status(500).json().end();
    });
  });
  
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id).then(data => {
      if (!data) {
        res.status(404).json().end();
      } else {
        res.status(200).json(data.comments);
      }
    }).catch(error => {
      res.status(500).json().end();
    });
  }); 

  module.exports = router;