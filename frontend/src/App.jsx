import React, { useState } from 'react';
import SchemaSelector from './components/SchemaSelector';
import FormBuilder from './components/FormBuilder';
import { fetchSchemaJson } from './services/apiService';

const App = () => {
  const [formStructure, setFormStructure] = useState(null);

  const handleSchemaSelect = async (schemaName) => {
    if (schemaName) {
      try {
        const structure = await fetchSchemaJson(schemaName);
        console.log('Otrzymana struktura JSON:', structure);
        setFormStructure(structure);
      } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
      }
    } else {
      setFormStructure(null);
    }
  };

  return (
    <div>
      <SchemaSelector onSelect={handleSchemaSelect} />
      {formStructure && <FormBuilder structure={formStructure} />}
    </div>
  );
};

export default App;
