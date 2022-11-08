const Post = require('../../models/Post')


async function editPostHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value.trim();
    const id = Post.id; 

    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({title}),
        headers: {'Content-Type' : 'application/json'}
    });

    if(response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText); 
    }
}

document.querySelector('.edit-post-form').addEventListener('submit', editPostHandler); 