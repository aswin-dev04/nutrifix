import express from 'express';
import auth from '../middleware/auth';
import { createOrder, getUserSingleOrder, getUserAllOrders, cancelOrder } from '../controllers/orderController';

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/:id', auth, getUserSingleOrder);
router.get('/', auth, getUserAllOrders);
router.delete('/:id', auth, cancelOrder);

export default router;