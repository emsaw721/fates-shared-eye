const router = require('express').Router();
const { Post, User, Comment, Vote } = require('../../models');

//get all users 
router.get('/', (req,res) => {
    User.findAll({
        attributes: {exclude: ['password']}
    }).then(allUsers => {
        res.json(allUsers)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err)
    })
});

//get one user by id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']},
        where: {id: req.params.id},
        include: [
            {
                model: Post
            },
            {
                model: Comment, 
                include: {
                    model: Post, 
                    attributes: ['title']
                }
            },
            {
                model: Post, 
                attributes: ['title'], 
                through: Vote,
                as: 'voted_posts'
            }
        ]
    }).then(oneUser => {
        if(!oneUser){
            res.status(404).json({message: 'No user found for that ID!'})
            return; 
        }
        res.json(oneUser); 
    }).catch(err => {
        console.log(err);
        res.status(500).json(err); 
    })
}); 

//create a new user
router.post('/', (req,res)=> {
    User.create({
        username: req.body.username, 
        email: req.body.email, 
        password: req.body.password
    }).then(newUser => {
        req.session.save(()=> {
            req.session.user_id = newUser.id; 
            req.session.username = newUser.username; 
            req.session.logginIn = true; 

            res.json(newUser); 
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err); 
    })
}); 

router.post('/login', (req,res) => {
    User.findOne({
        where:{ email: req.body.email}
    }).then(foundUser => {
        if(!foundUser){
            res.status(404).json({message: 'No user associated with that email!'})
            return; 
        }

        const validPassword = foundUser.checkPassword(req.body.password)

        if(!validPassword) {
            res.status(400).json({message: 'Incorrect password!'});
            return; 
        }


        req.session.save(() => {
            req.session.user_id = foundUser.id; 
            req.session.username = foundUser.username; 
            req.session.loggedIn = true; 

            res.json({user: foundUser, message: 'You are now logged in!'}); 

        }); 
    }); 
}); 

// logout by ending/deleting the session 
router.post('/logout', (req,res) => {
    if(req.session.logginIn) {
        req.session.destroy(() => {
            res.status(204).end(); 
        });
    } else {
        res.status(404).end(); 
    }
}); 

router.put('/:id', (req, res) => {
    User.update(req.body, {  //passing through req.body to update specifics, not replace whole thing 
        individualHooks: true, 
        where: { id: req.params.id}
    }).then(updatedUser => {
        if(!updatedUser){
            res.status(404).json({message: 'No user found with this id!'});
            return; 
        }
        res.json(updatedUser); 
    }).catch(err => {
        console.log(err);
        res.status(500).json(err); 
    }); 
}); 

router.delete('/:id', (req,res) => {
    User.destroy({
        where: { id: req.params.id}
    }).then(deletedUser => {
        if(!deletedUser){
            res.status(404).json({message: 'There is no user associated with that id!'});
            return; 
        }
        res.json(deletedUser)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err); 
    }); 
}); 

module.exports = router; 

