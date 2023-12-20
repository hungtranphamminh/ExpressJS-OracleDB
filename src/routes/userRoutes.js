// userRoutes.js

import express from 'express';
import userController from '../controllers/userController.js';

const userRouter = express.Router();

// routes
userRouter.get('/', userController.getAllUsers);
// login route
userRouter.post('/login', userController.login); 

export default userRouter;
