// Centralized express-validator rule sets for the highest-risk public endpoints:
// registration, login, forgot-password, and the Contact Us form. These run
// BEFORE the controllers, so malformed/malicious input is rejected consistently
// with a 400 instead of reaching business logic. The role-specific field checks
// (e.g. hostel_picture required for hostelOwner) already live in the controllers
// and are left alone here — this layer only validates the fields every
// registration shares, so it can't drift from the multi-role logic.
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

const validateRegister = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('A valid email address is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('phone_number').trim().notEmpty().withMessage('Phone number is required'),
  body('cnic').trim().notEmpty().withMessage('CNIC is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('role')
    .trim()
    .toLowerCase()
    .isIn(['student', 'hostelowner', 'kitchenowner'])
    .withMessage('Role must be student, hostelOwner, or kitchenOwner'),
  handleValidationErrors,
];

const validateLogin = [
  body('email').trim().isEmail().withMessage('A valid email address is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validateForgotPassword = [
  body('email').trim().isEmail().withMessage('A valid email address is required'),
  handleValidationErrors,
];

const validateContactMessage = [
  body('subject').optional().trim(),
  body('message').trim().notEmpty().withMessage('Message is required'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateContactMessage,
};
