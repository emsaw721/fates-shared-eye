const router = require('express').Router();

const sequelize = require('../config/connection'); 
const {Post, User, Comment} = require('../models');


// get all posts for homepage 
router.get('/', (req,res) => {
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'] ],
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
        const posts = dbPostData.map(post => post.get({plain: true})); // need to do {plain:true} otherwise too much stuff comes back 

        res.render('homepage', {posts, loggedIn: req.session.loggedIn}); 
    }).catch(err => {
        console.log(err);
        res.status(500).json(err); 
    })
});

//get single post 
router.get('/post/:id', (req,res) =>{
    Post.findOne({
        where: {id: req.params.id},
        attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'] ],
        include: [
            {
                model: User, 
                attributes: ['username']
            }
        ]
    }).then(dbPostData => {
        if(!dbPostData){
            res.status(404).json({message: 'No post found with this id'});
            return; 
        }
        
        const post =dbPostData.get({plain:true});

        res.render('single-post', {post, loggedIn: req.session.loggedIn}); 
    }).catch(err => {
        console.log(err)
        res.status(500).json(err); 
    })
});

// makes the user login 
router.get('/login', (req,res) => {
    // if the session is logged In, then the user is redirected to the homepage
    if(req.session.loggedIn) {
        res.redirect('/');
        return; 
    }
    // if not logged in, the user is directed to the login page 
    res.render('login')
}); 

module.exports = router; 