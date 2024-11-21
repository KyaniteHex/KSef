import xml2js from 'xml2js';

export const processXsd = async (xsdContent) => {
    const parser = new xml2js.Parser();
    const xsdParsed = await parser.parseStringPromise(xsdContent);

    const schemaKey = Object.keys(xsdParsed).find((key) => key.includes('schema'));
    if (!schemaKey) {
        throw new Error('Nie znaleziono głównego elementu "schema" w pliku XSD.');
    }

    const schema = xsdParsed[schemaKey];
    const dictionaries = processDictionaries(schema);

    return { schema, dictionaries };
};

const processDictionaries = (schema) => {
    const dictionaries = {};
    const simpleTypes =
        schema['xs:simpleType'] || schema['xsd:simpleType'] || schema['simpleType'] || [];

    simpleTypes.forEach((type) => {
        const name = type.$.name;
        const enumerations =
            type['xs:restriction']?.[0]['xs:enumeration'] ||
            type['xsd:restriction']?.[0]['xsd:enumeration'] ||
            type['restriction']?.[0]['enumeration'];

        if (enumerations) {
            dictionaries[name] = enumerations.map((enumVal) => enumVal.$.value);
        }
    });

    return dictionaries;
};
