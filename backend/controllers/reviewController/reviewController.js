// controllers/reviewController/reviewController.js
const Review = require('../../models/student/Review');
const Booking = require('../../models/student/Booking');
const Order = require('../../models/student/Order');
const logger = require('../../utils/logger');

// Fallback avatar used on the home page carousel if a student has no picture.
const FALLBACK_AVATAR =
  'https://cdn-icons-png.flaticon.com/512/149/149071.png';

// --- Integrity check: has this student actually used this hostel/kitchen? ---
// Hostel: any non-cancelled booking for that hostel.
// Kitchen: any order placed with that kitchen.
// This is what stops people reviewing places they never used.
async function hasUsedTarget(studentId, targetType, targetId) {
  if (targetType === 'hostel') {
    const booking = await Booking.findOne({
      student_id: studentId,
      hostel_id: targetId,
      status: { $ne: 'Cancelled' },
    });
    return !!booking;
  }
  if (targetType === 'kitchen') {
    const order = await Order.findOne({
      customerId: studentId,
      kitchenOwnerId: targetId,
    });
    return !!order;
  }
  return false;
}

function shapeForCard(review) {
  const s = review.student_id || {};
  const name = [s.first_name, s.last_name].filter(Boolean).join(' ') || 'Student';
  return {
    id: review._id,
    name,
    image: s.profile_picture || FALLBACK_AVATAR,
    review: review.review_text,
    rating: review.rating,
    date: review.createdAt,
  };
}

// GET /api/reviews/recent  (public) — feeds the home page carousel.
// Only returns reviews that actually have text, so the cards look like the
// existing testimonial cards.
exports.getRecentReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ review_text: { $ne: '' } })
      .sort({ createdAt: -1 })
      .limit(12)
      .populate('student_id', 'first_name last_name profile_picture');

    res.status(200).json(reviews.map(shapeForCard));
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/:target_type/:target_id  (public) — detail page list + average.
exports.getReviewsForTarget = async (req, res, next) => {
  try {
    const { target_type, target_id } = req.params;
    if (!['hostel', 'kitchen'].includes(target_type)) {
      return res.status(400).json({ message: 'Invalid target type' });
    }

    const reviews = await Review.find({ target_type, target_id })
      .sort({ createdAt: -1 })
      .populate('student_id', 'first_name last_name profile_picture');

    const count = reviews.length;
    const average = count
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1))
      : 0;

    res.status(200).json({
      average,
      count,
      reviews: reviews.map(shapeForCard),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/eligibility?target_type=&target_id=  (auth) —
// tells the frontend whether to show the review form, and returns the
// student's existing review (if any) so the form can pre-fill for editing.
exports.getMyEligibility = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { target_type, target_id } = req.query;

    if (!['hostel', 'kitchen'].includes(target_type) || !target_id) {
      return res.status(400).json({ message: 'target_type and target_id are required' });
    }

    // Only students can review.
    if (req.user.role && req.user.role !== 'student') {
      return res.status(200).json({ eligible: false, reason: 'not_a_student', myReview: null });
    }

    const eligible = await hasUsedTarget(studentId, target_type, target_id);
    const myReview = await Review.findOne({ student_id: studentId, target_type, target_id });

    res.status(200).json({
      eligible,
      reason: eligible ? 'ok' : 'no_booking_or_order',
      myReview: myReview
        ? { id: myReview._id, rating: myReview.rating, review_text: myReview.review_text }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/reviews  (auth) — create or update the student's review.
// Body: { target_type, target_id, rating, review_text }
exports.createOrUpdateReview = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { target_type, target_id, rating, review_text = '' } = req.body;

    if (req.user.role && req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can leave reviews.' });
    }
    if (!['hostel', 'kitchen'].includes(target_type) || !target_id) {
      return res.status(400).json({ message: 'target_type and target_id are required.' });
    }
    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // The core integrity gate.
    const allowed = await hasUsedTarget(studentId, target_type, target_id);
    if (!allowed) {
      return res.status(403).json({
        message:
          target_type === 'hostel'
            ? 'You can only review a hostel you have booked.'
            : 'You can only review a kitchen you have ordered from.',
      });
    }

    const review = await Review.findOneAndUpdate(
      { student_id: studentId, target_type, target_id },
      { rating: numericRating, review_text: (review_text || '').trim() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    logger.debug('Review saved', review._id);
    res.status(201).json({ message: 'Review saved', review });
  } catch (error) {
    // Duplicate key just means a race on the unique index — treat as success-ish.
    if (error && error.code === 11000) {
      return res.status(409).json({ message: 'You have already reviewed this place.' });
    }
    next(error);
  }
};
