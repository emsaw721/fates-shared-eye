// import all models 
const Post = require('./Post');
const User = require('./User');
const Vote = require('./Vote');
const Comment = require('./Comment');


// user associations 
// user can post, vote on posts, comment on posts, delete posts 
User.hasMany(Post, {
    foreignKey: 'user_id'
});

User.belongsToMany(Post, {
    through: Vote, 
    as: 'voted_posts',

    foreignKey: 'user_id',
    onDelete: 'SET NULL'
}); 

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
}); 

//comment associations
// comments can be posted by users, users comment on posts --> so comment belongs to post? 
// belongsTo associations where foreign key for one-to-one exists on source model, hasOne association where foreign key for 1:1 exists on target model 

Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL' 
}); 

Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'SET NULL'
}); 

// post associations 
// post is something that a user makes, post can be deleted, post can be voted on, post can be commented on 

Post.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
}); 

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts', 

    foreignKey: 'post_id',
    onDelete: 'SET NULL'
}); 

Post.hasMany(Vote, {
    foreignKey: 'post_id'
}); 

Post.hasMany(Comment, {
    foreignKey: 'post_id'
}); 

// vote associations 
// votes are made by user, belong to posts

Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'SET NULL'
}); 

module.exports = { User, Comment, Post, Vote}; 

