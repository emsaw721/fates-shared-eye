const router = require('express').Router();
const sequelize = require('../config/connection'); 
const {Post, Comment, User} = require('../models');
const withAuth = require('../utils/auth');

// get all posts for dashboard 
router.get('/', withAuth, (req,res) => {
    console.log(req.session)

    Post.findAll({
       where:{user_id: req.session.user_id}, 
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
    }).then(allPosts => {
        const posts = allPosts.map(post => post.get({plain: true})); 
        res.render('dashboard', {posts, loggedIn: true}); 
    }).catch(err => {
        console.log(err)
        res.status(500).json(err); 
    });
}); 


router.get('/edit/:id', withAuth, (req,res) => {
    Post.findByPK(req.params.id, {
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
    }).then(onePost => {
        if(onePost) {
            const post = onePost.get({plain: true});

            res.render('edit-post', {post, loggedIn: true});
        } else { res.status(404).end();}
    }).catch(err => { res.status(500).json(err);})
});

module.exports = router; 