import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import { fileURLToPath } from 'url';

// Ustawienie __dirname dla modułów ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Słownik mapowania typów
const typeMapping = {
  TAdresEmail: 'email',
  TNumerTelefonu: 'tel',
  TData: 'date',
  TDataT: 'date',
  TKwotowy: 'number',
  TKwotowy2: 'number',
  TProcentowy: 'number',
  TIlosci: 'number',
  TNaturalny: 'number',
  TZnakowy: 'text',
  TZnakowy20: 'text',
  TZnakowy50: 'text',
  TNrKRS: 'text',
  TNrREGON: 'text',
  string: 'text',
};

// Funkcja do czyszczenia nazwy typu z prefiksu
function cleanTypeName(typeName) {
  if (typeName.includes(':')) {
    const [prefix, localName] = typeName.split(':');
    return prefix === 'tns' || 'etd' ? localName : typeName; // Usuwamy tylko prefiks `tns:`
  }
  return typeName;
}

// Funkcja do przetwarzania słowników
function processDictionaries(schema) {
  const dictionaries = {};

  const simpleTypes = schema['xs:simpleType'] || schema['xsd:simpleType'] || schema['simpleType'] || [];
  simpleTypes.forEach((type) => {
    const name = cleanTypeName(type.$.name); // Usuwamy prefiksy
    const enumerations =
      type['xs:restriction']?.[0]['xs:enumeration'] ||
      type['xsd:restriction']?.[0]['xsd:enumeration'] ||
      type['restriction']?.[0]['enumeration'];
    if (enumerations) {
      dictionaries[name] = enumerations.map((enumVal) => enumVal.$.value);
    }
  });

  return dictionaries;
}

// Funkcja do mapowania typu na wartość ze słownika
function mapToType(cleanType) {
  return typeMapping[cleanType] || 'text'; // Domyślny typ to 'text', jeśli brak w słowniku
}

// Funkcja do generowania struktury JSON dla elementów
function generateJsonForElement(element, dictionaries, schema) {
  if (!element || !element.$ || !element.$.name) {
    console.warn('Pominięto nieprawidłowy element:', element);
    return null;
  }

  const name = element.$.name;
  const type = element.$.type || 'string';
  const cleanType = cleanTypeName(type);
  const mappedType = mapToType(cleanType);
  const minOccurs = element.$.minOccurs || '1';
  const isRequired = minOccurs !== '0';

  // Pobieranie dokumentacji
  const documentation =
    element['xs:annotation']?.[0]['xs:documentation']?.[0] ||
    element['xsd:annotation']?.[0]['xsd:documentation']?.[0] ||
    element['annotation']?.[0]['documentation']?.[0] ||
    'Brak dokumentacji';

  const jsonElement = {
    name: name,
    type: mappedType,
    required: isRequired,
    documentation: documentation,
  };

  if (dictionaries[cleanType]) {
    jsonElement.values = dictionaries[cleanType];
  }

  // Jeśli element ma dzieci w <xsd:sequence> lub <xsd:choice>, przetwórz je
  const sequenceChildren =
    element['xs:complexType']?.[0]['xs:sequence']?.[0]['xs:element'] ||
    element['xsd:complexType']?.[0]['xsd:sequence']?.[0]['xsd:element'] ||
    element['complexType']?.[0]['sequence']?.[0]['element'];

  const choiceChildren =
    element['xs:complexType']?.[0]['xs:choice']?.[0]['xs:element'] ||
    element['xsd:complexType']?.[0]['xsd:choice']?.[0]['xsd:element'] ||
    element['complexType']?.[0]['choice']?.[0]['element'];

  const children = [];
  if (sequenceChildren) {
    children.push(...sequenceChildren.map((child) => generateJsonForElement(child, dictionaries, schema)).filter(Boolean));
  }
  if (choiceChildren) {
    children.push({
      choice: choiceChildren.map((child) => generateJsonForElement(child, dictionaries, schema)).filter(Boolean),
    });
  }

  // Jeśli element ma typ zdefiniowany w <xsd:complexType>, znajdź i przetwórz jego definicję
  if (schema && cleanType) {
    const complexTypes =
      schema['xs:complexType'] || schema['xsd:complexType'] || schema['complexType'] || [];
    const matchedType = complexTypes.find((type) => type.$.name === cleanType);

    if (matchedType) {
      const matchedSequenceChildren =
        matchedType['xs:sequence']?.[0]['xs:element'] ||
        matchedType['xsd:sequence']?.[0]['xsd:element'] ||
        matchedType['sequence']?.[0]['element'];

      if (matchedSequenceChildren) {
        children.push(
          ...matchedSequenceChildren.map((child) => generateJsonForElement(child, dictionaries, schema)).filter(Boolean)
        );
      }
    }
  }

  if (children.length > 0) {
    jsonElement.children = children;
  }

  return jsonElement;
}

export const processXsdToJson = async (xsdContent) => {
  const parser = new xml2js.Parser();
  const xsdParsed = await parser.parseStringPromise(xsdContent);

  const schemaKey = Object.keys(xsdParsed).find((key) => key.includes('schema'));
  if (!schemaKey) {
    throw new Error('Nie znaleziono elementu schema.');
  }

  const schema = xsdParsed[schemaKey];
  const dictionaries = processDictionaries(schema);

  const elements = schema['xs:element'] || schema['xsd:element'] || schema['element'] || [];
  const allElementsJson = elements.map((el) => generateJsonForElement(el, dictionaries, schema)).filter(Boolean);

  
  return allElementsJson;
};

// Funkcja do pobierania listy dostępnych schematów
export const getSchemas = () => {
  const schemaDir = path.join(__dirname, '../schemas/');
  return fs.readdirSync(schemaDir).filter((file) => file.endsWith('.xsd'));
};
