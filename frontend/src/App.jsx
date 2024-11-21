import React, { useState } from 'react';
import { parseXsd } from './services/apiService';

const App = () => {
  const [xsdContent, setXsdContent] = useState('');
  const [formStructure, setFormStructure] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await parseXsd(xsdContent);
      setFormStructure(result);
    } catch (error) {
      console.error('Błąd podczas parsowania XSD:', error);
    }
  };

  return (
    <div>
      <h1>Dynamiczny Formularz z XSD</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="10"
          cols="50"
          value={xsdContent}
          onChange={(e) => setXsdContent(e.target.value)}
          placeholder="Wklej tutaj schemat XSD"
        />
        <button type="submit">Generuj Formularz</button>
      </form>
      {formStructure && <div>{JSON.stringify(formStructure)}</div>}
    </div>
  );
};

export default App;
