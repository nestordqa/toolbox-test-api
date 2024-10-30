// routes/ejemploRoutes.js
import express from 'express';
import { filesManagement } from '../controllers/filesController.js';

const router = express.Router();

router.get('/files/data', filesManagement);

export default router;