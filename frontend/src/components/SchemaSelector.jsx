import React, { useState, useEffect } from 'react';

const SchemaSelector = ({ onSelect }) => {
  const [schemas, setSchemas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/xsd/list-schemas')
      .then((res) => res.json())
      .then((data) => setSchemas(data))
      .catch((error) => console.error('Błąd pobierania listy schematów:', error));
  }, []);

  return (
    <div>
      <h2>Wybierz schemat faktury:</h2>
      <select onChange={(e) => onSelect(e.target.value)}>
        <option value="">-- Wybierz schemat --</option>
        {schemas.map((schema) => (
          <option key={schema} value={schema}>
            {schema}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SchemaSelector;
