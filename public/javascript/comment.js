

//request to server --> db
async function commentFormHandler(event) {
//event.preventdefault stops form submit 
  
    const id = document.querySelector('#post-id').getAttribute('data-id'); //or .dataset.id 

    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();
    // make data attribute like above to store in html. pass down to handlebars 
 

    if(comment_text) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({id, comment_text}),
            headers: {'Content-Type': 'application/json'}
        });

        if(response.ok){
            document.location.reload();
        } else {
            alert(response.statusText); 
        }
    }
};

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler); 
