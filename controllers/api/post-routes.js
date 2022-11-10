
const router = require('express').Router();
const sequelize = require('../../config/connection'); 
const { Post, User, Comment, Vote } = require('../../models');
const withAuth = require('../../utils/auth'); 

// get all posts
router.get('/', (req,res) => {
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        include: [
            {
                model: Comment, 
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(allPosts =>  res.json(allPosts)).catch(err => {
        console.log(err);
        res.status(500).json(err); 
    })
});

// get a post by id 
router.get('/:id', (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at',  [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        include: [
            {
                model: Comment, 
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User, 
                    attributes: ['username']
                }
            },
            {
                model: User, 
                attributes: ['username']
            }
        ]
    }).then(onePost => {
        if(!onePost) {
            res.status(404).json({message: 'No post found with this id!'})
            return; 
        }
        res.json(onePost); 
    }).catch(err => {
        console.log(err);
        res.status(500).json(err); 
    })
}); 

// create a post on 
router.post('/', withAuth, (req,res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    }).then(createdPost => res.json(createdPost))
      .catch(err => {
        console.log(err);
        res.status(500).json(err)
      })
});

//updates the vote numbers 
router.put('/upvote', withAuth, (req,res) => {
    //upvote is custom static method created in Post.js line 5 to line 25
    // then pass session id along with all destructured properties in req.body 
    Post.upvote({ ...req.body, user_id: req.session.user_id}, {Vote, Comment, User})
    .then(updatedVote => res.json(updatedVote))
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
}); 


//updates post at a certain id 
router.put ('/:id', withAuth, (req,res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: { id: req.params.id }
        }
    ).then(updatedPost => {
        if(!updatedPost) {
            res.status(404).json({message: 'No post found for this id!'})
            return; 
        }
        res.json(updatedPost)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err); 
    })
}); 


router.delete('/:id', withAuth, (req,res) => {
    Post.destroy(
        {
            where: { id: req.params.id }
        }
    ).then(deletedPost => {
        if(!deletedPost){
            res.status(404).json({message: 'No post found for this id!'})
            return; 
        }
        res.json(deletedPost); 
    }).catch(err => {
        console.log(err);
        res.status(500).json(err); 
    })
});

module.exports = router; 

