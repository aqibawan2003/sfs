const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getAllContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} = require('../controllers/contactController');
const { adminAuth } = require('../middlewares/adminAuth');
const { validateContactMessage } = require('../validators/requestValidators');

// Public — anyone can submit the contact form
router.post('/submit', validateContactMessage, submitContactMessage);

// Admin only — view, update, delete contact messages
router.get('/all', adminAuth, getAllContactMessages);
router.patch('/:id/status', adminAuth, updateContactMessageStatus);
router.delete('/:id', adminAuth, deleteContactMessage);

module.exports = router;
