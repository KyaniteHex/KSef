import express from 'express';
import { parseXsd } from '../controllers/xsdController.js';

const router = express.Router();

router.post('/parse',parseXsd);

export default router;