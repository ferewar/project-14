document.addEventListener('DOMContentLoaded', () => {
    // Handler for creating a new post
    async function newFormHandler(event) {
        event.preventDefault();

        const title = document.querySelector('input[name="post-title"]').value;
        const content = document.querySelector('textarea[name="post-content"]').value;

        const response = await fetch('/api/posts', {
            method: 'POST',
            body: JSON.stringify({
                title,
                content
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }

    // Handler for deleting a post
    async function deletePostHandler(event) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }

    // Handler for editing a post
    async function editPostHandler(event) {
        const id = event.target.getAttribute('data-id');
        toggleForm(true, id);
    }

    // Handler for updating a post
    async function updatePostHandler(event, id) {
        event.preventDefault();

        const title = document.querySelector('input[name="post-title"]').value;
        const content = document.querySelector('textarea[name="post-content"]').value;

        const response = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title,
                content
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            document.location.reload();
        } else {
            alert('Failed to update post');
        }
    }

    // Toggle form visibility
    function toggleForm(isEditing = false, postId = null) {
        const form = document.getElementById('new-post-form');
        form.style.display = form.style.display === 'block' ? 'none' : 'block';
        if (isEditing && postId) {
            form.querySelector('form').setAttribute('data-id', postId);
            form.querySelector('form').removeEventListener('submit', newFormHandler);
            form.querySelector('form').addEventListener('submit', (event) => updatePostHandler(event, postId));
        } else {
            form.querySelector('form').addEventListener('submit', newFormHandler);
        }
    }

    // Event listeners
    document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);
    document.querySelectorAll('.delete-post-btn').forEach(btn => btn.addEventListener('click', deletePostHandler));
    document.querySelectorAll('.edit-post-btn').forEach(btn => btn.addEventListener('click', editPostHandler));
});
