const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll();
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new post
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      userId: req.session.userId, // Ensure the user is logged in with withAuth
    });
    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update an existing post
router.put('/:id', withAuth, async (req, res) => { 
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        content: req.body.content
      },
      {
        where: {
          id: req.params.id,
          userId: req.session.userId // Ensure the user is authorized to update the post
        }
      }
    );
    if (updatedPost[0] > 0) { // Check if any rows were updated
      res.status(200).json({ message: 'Post updated successfully' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a post
router.delete('/:id', withAuth, async (req, res) => { 
  try {
    const result = await Post.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId // Ensure the user is authorized to delete the post
      }
    });
    if (result > 0) { // Check if any rows were deleted
      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
