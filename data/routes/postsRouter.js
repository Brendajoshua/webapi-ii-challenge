const express = require('express');
const db = require('../data/db')

const router = express.Router();

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." }).end();
      }
      db.insert({ title, contents }).then(post => {
        db.findById(post.id).then(postData => {
          res.status(201).json(postData);
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
 
  db.findById(id).then(post => {
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    } else {
      
      db.insertComment({ text, post_id: id }).then(comment => {
    
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
    db.find().then(postList => {
      if (!postList) {
        res.status(404).json({ error: "The posts information could not be retrieved." }).end();
      } else {
        res.status(200).json(postList);
      }
    }).catch(error => {
      res.status(500).json({ error: "The posts information could not be retrieved." }).end();
    });
  });
  
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id).then(post => {
      if (!post) {
        res.status(404).json({ message: "The post with the specified ID does not exist." }).end();
      } else {
        res.status(200).json(post);
      }
    }).catch(error => {
      res.status(500).json({ error: "The post information could not be retrieved." }).end();
    });
  });
  
  router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    db.findById(id).then(post => {
      if (!post) {
        res.status(404).json({ message: "The post with the specified ID does not exist." }).end();
      } else {
        db.findPostComments(id).then(comments => {
            res.status(200).json(comments);
          }).catch(error => {
            res.status(500).json({ error: "The comments information could not be retrieved." }).end();
          });
      }
    }).catch(error => {
      res.status(500).json({ error: "The post information could not be retrieved." }).end();
    });
  });
  
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id).then(post => {
      if (!post) {
        res.status(404).json({ message: "The post with the specified ID does not exist." }).end();
      } else {
        db.remove(id).then(deleted => {
            res.status(204).json({ ...post, deleted: deleted });
          }).catch(error => {
            res.status(500).json({ error: "The post could not be removed" }).end();
          });
      }
    }).catch(error => {
      res.status(500).json({ error: "The post information could not be retrieved." }).end();
    });
  });
  
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." }).end();
  }
  db.findById(id).then(post => {
    if (!post) {
      res.status(404).json({ message: "The post with the specified ID does not exist." }).end();
      } else {
        db.update(id, { title, contents }).then(updated => {
            res.status(200).json({ ...post, title, contents, updated });
          }).catch(error => {
            res.status(500).json({ error: "The post information could not be modified." }).end();
          });
      }
    }).catch(error => {
      res.status(500).json({ error: "The post information could not be retrieved." }).end();
    });
  }); 

  module.exports = router;