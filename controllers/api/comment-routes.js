const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');


// get all comments 
router.get('/', (req, res) => {
    Comment.findAll()
        .then(allComments => res.json(allComments))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// create a comment 
router.post('/', withAuth, (req, res) => {
  console.log(req.body)
    // going to create a comment, need text, user id for user making post, and the posts id
    Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.session.user_id,
        post_id: req.body.id
    }).then(createdComment => {
        console.log(createdComment)
        res.json(createdComment)}).catch(err => {
        console.log(err)
        res.status(400).json(err);
    })
});

//delete a comment 
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: { id: req.params.id }
    }).then(deletedComment => {
        if (!deletedComment) {
            res.status(404).json({ message: 'No comment found for this id!' })
            return;
        }
        res.json(deletedComment);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err); 
    });
}); 

module.exports = router; 