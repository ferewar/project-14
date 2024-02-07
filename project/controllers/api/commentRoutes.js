const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all comments
router.get('/', async (req, res) => {
  try {
    const commentData = await Comment.findAll();
    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new comment
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      userId: req.session.userId 
    });
    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a comment
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const result = await Comment.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId // Ensures users can only delete your own comments
      }
    });

    if (result > 0) {
      res.status(200).json({ message: 'Comment deleted successfully' });
    } else
    if (result > 0) {
        res.status(200).json({ message: 'Comment deleted successfully' });
      } else {
        res.status(404).json({ message: 'Comment not found or user not authorized' });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
