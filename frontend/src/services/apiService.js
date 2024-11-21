import axios from 'axios';

export const parseXsd = async (xsdContent) => {
    const response = await axios.post('/api/xsd/parse', { xsdContent });

    return response.data;
};
