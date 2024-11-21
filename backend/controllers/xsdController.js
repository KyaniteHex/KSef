import { processXsd } from '../services/xsdService.js';

export const parseXsd = async (req, res) => {
  try {
    const xsdContent = req.body.xsdContent;
    const result = await processXsd(xsdContent);
    res.json(result);
    console.log('Otrzymano żądanie z danymi:', req.body);

  } catch (error) {
    console.error('Błąd przetwarzania XSD:', error.message);
    res.status(500).json({ error: 'Błąd podczas przetwarzania schematu XSD' });
  }
};
