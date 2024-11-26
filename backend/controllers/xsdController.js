import { getSchemas, processXsdToJson } from '../services/xsdService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const listSchemas = (req, res) => {
  try {
    const schemas = getSchemas();
    res.status(200).json(schemas);
  } catch (error) {
    console.error('Błąd pobierania listy schematów:', error);
    res.status(500).json({ error: 'Błąd pobierania schematów' });
  }
};

export const parseXsdToJson = async (req, res) => {
  try {
    const { schemaName } = req.body;
    const schemaPath = path.join(__dirname, '../schemas', schemaName);
    const xsdContent = fs.readFileSync(schemaPath, 'utf-8');

    const formStructure = await processXsdToJson(xsdContent);
    res.status(200).json(formStructure);
  } catch (error) {
    console.error('Błąd przetwarzania XSD:');
    res.status(500).json({ error: 'Błąd podczas przetwarzania schematu XSD' });
  }
};
