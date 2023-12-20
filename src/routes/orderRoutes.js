// userRoutes.js

import express from 'express';
import orderController from '../controllers/orderController.js';
const orderRouter = express.Router();

// default route -  get all product 
orderRouter.get('/', orderController.getOrderInfo);
orderRouter.put('/inc',orderController.updateOrderQuantity);
orderRouter.delete('/del',orderController.deleteOrder);
orderRouter.post('/make', orderController.makeOrder);
orderRouter.get('/cartCount', orderController.getOrderCount);

export default orderRouter;
