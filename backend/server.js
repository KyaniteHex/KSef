import express from 'express';
import cors from 'cors';
import xsdRoutes from './routes/xsdRoutes.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/xsd', xsdRoutes);

app.get('/', (req, res) => {
  res.send('Backend działa poprawnie.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
