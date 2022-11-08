
const {v4: uuid4} = require('uuid')

async function deletePostHandler(event) {
    event.preventDefault();

    const id = uuid4(); 

    const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
    }); 
}