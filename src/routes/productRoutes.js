// userRoutes.js

import express from 'express';
import productController from '../controllers/productController.js';
const productRouter = express.Router();

// default route -  get all product 
productRouter.get('/', productController.getProducts);
productRouter.get('/highest', productController.getMaxPrice);
productRouter.get('/lowest',productController.getMinPrice);
productRouter.get('/nav', productController.getProductTags);
productRouter.get('/item', productController.getProductById);

export default productRouter;
