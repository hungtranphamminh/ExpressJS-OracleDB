// routes/router.js

import express from 'express';
import userRouter from './userRoutes.js';
import productRouter from './productRoutes.js';
import orderRouter from './orderRoutes.js';
// Import other routes here...

const router = express.Router();

// Use routes
router.use('/api/users', userRouter);
router.use('/api/products', productRouter)
router.use('/api/order', orderRouter)

export default router;