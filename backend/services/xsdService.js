// Importy zgodne z normami ES6
import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Przetwarzanie XSD do JSON
export const processXsdToJson = async (xsdContent) => {
    const parser = new xml2js.Parser();

    let xsdParsed;
    try {
        xsdParsed = await parser.parseStringPromise(xsdContent);
    } catch (err) {
        throw new Error(`Błąd parsowania XSD: ${err.message}`);
    }

    const schemaKey = Object.keys(xsdParsed).find((key) => key.includes('schema'));
    if (!schemaKey) {
        throw new Error('Nie znaleziono elementu schema w pliku XSD.');
    }

    const schema = xsdParsed[schemaKey];

    try {
        // Wstępne przekształcenie schematu na uproszczoną strukturę JSON
        const simplifiedJson = simplifySchema(schema);
        return  simplifiedJson ;
    } catch (err) {
        throw new Error(`Błąd przetwarzania schematu: ${err.message}`);
    }
};

// Funkcja rekurencyjna do upraszczania elementów JSON
function simplifyElement(element) {
    const simplified = {};

    if (element["$"]) {
        simplified.name = element["$"]?.name || null;
        simplified.type = element["$"]?.type || null;
        simplified.optional= element["$"]?.minOccurs==='0' ? true: false;
        simplified.minOccurs = element["$"]?.minOccurs || null;
        simplified.maxOccurs = element["$"]?.maxOccurs || null;
    }

    if (element["xsd:annotation"] && element["xsd:annotation"][0]?.["xsd:documentation"]) {
        simplified.documentation = element["xsd:annotation"][0]["xsd:documentation"][0];
    }

    if (element["xsd:complexType"]) {
        simplified.children = element["xsd:complexType"].flatMap(processComplexType);
    }

    if (element["xsd:sequence"] && element["xsd:sequence"][0]?.["xsd:element"]) {
        simplified.children = (simplified.children || []).concat(
            element["xsd:sequence"][0]["xsd:element"].map(simplifyElement)
        );
    }

    if (element["xsd:choice"]) {
        simplified.children = (simplified.children || []).concat(
            processChoice(element["xsd:choice"][0])
        );
    }

    return simplified;
}

function processComplexType(complexType) {
    let children = [];

    if (complexType["xsd:sequence"] && complexType["xsd:sequence"][0]?.["xsd:element"]) {
        children = children.concat(
            complexType["xsd:sequence"][0]["xsd:element"].map(simplifyElement)
        );
    }

    if (complexType["xsd:choice"]) {
        children = children.concat(
            processChoice(complexType["xsd:choice"][0])
        );
    }

    return children;
}

function processChoice(choice) {
    const options = [];

    if (choice["xsd:sequence"]) {
        choice["xsd:sequence"].forEach(sequence => {
            if (sequence["xsd:element"]) {
                options.push(...sequence["xsd:element"].map(simplifyElement));
            }

            if (sequence["xsd:choice"]) {
                options.push(...processChoice(sequence["xsd:choice"][0]));
            }
        });
    }

    if (choice["xsd:element"]) {
        options.push(...choice["xsd:element"].map(simplifyElement));
    }

    return options;
}

function simplifySchema(schema) {
    if (!schema['xsd:element'] || !Array.isArray(schema['xsd:element'])) {
        throw new Error('Nieprawidłowa struktura JSON: oczekiwano tablicy elementów.');
    }

    return schema['xsd:element'].map(simplifyElement);
}

// Pobieranie dostępnych schematów
export const getSchemas = () => {
    const schemaDir = path.join(__dirname, '../schemas/');
    try {
        return fs.readdirSync(schemaDir).filter((file) => file.endsWith('.xsd'));
    } catch (err) {
        throw new Error(`Błąd odczytu katalogu schematów: ${err.message}`);
    }
};