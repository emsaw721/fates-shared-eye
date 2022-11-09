
const router = require('express').Router();
const sequelize = require('../../config/connection'); 
const { Post, User, Comment, Vote } = require('../../models');
const withAuth = require('../../utils/auth'); 

// get all users 
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
    }).then(dbPostData =>  res.json(dbPostData)).catch(err => {
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
    }).then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({message: 'No post found with this id!'})
            return; 
        }
        res.json(dbPostData); 
    }).catch(err => {
        console.log(err);
        res.status(500).json(err); 
    })
}); 