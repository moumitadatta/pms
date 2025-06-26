const express = require('express');
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
  assignTicket,
  resolveTicket,
} = require('../controllers/ticketController');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getTickets)
  .post(protect, createTicket);

router
  .route('/:id')
  .get(protect, getTicket)
  .put(protect, updateTicket)
  .delete(protect, deleteTicket);

router.route('/:id/assign').put(protect, authorize('admin'), assignTicket);
router.route('/:id/resolve').put(protect, resolveTicket);

module.exports = router;