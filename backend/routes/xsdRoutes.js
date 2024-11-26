import express from 'express';
import { listSchemas, parseXsdToJson } from '../controllers/xsdController.js';

const router = express.Router();

router.get('/list-schemas', listSchemas); // Lista schematów
router.post('/parse-xsd', parseXsdToJson);

export default router;
