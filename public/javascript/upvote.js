
const Post = require('../../models/Post')

async function upVoteClickHandler(event){
    event.preventDefault(); 

    const id = Post.id;

    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({post_id: id}),
        headers: {'Content-Type': 'application/json'}
    });

    if(response.ok){
        document.location.reload();
    } else {
        alert(response.statusText); 
    }
}

document.querySelector('.upvote-btn').addEventListener('click', upVoteClickHandler); 