import axios from 'axios';

export const fetchSchemaJson = async (schemaName) => {
  const response = await axios.post('http://localhost:5000/api/xsd/parse-xsd', { schemaName });
  return response.data;
};
