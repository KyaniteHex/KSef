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
  return typeName.includes(':') ? typeName.split(':')[1] : typeName;
}

// Funkcja do przetwarzania słowników
function processDictionaries(schema) {
  const dictionaries = {};

  const simpleTypes = schema['xs:simpleType'] || schema['xsd:simpleType'] || schema['simpleType'] || [];
  simpleTypes.forEach((type) => {
    const name = type.$.name;
    const enumerations =
      type['xs:restriction']?.[0]['xs:enumeration'] ||
      type['xsd:restriction']?.[0]['xsd:enumeration'] ||
      type['restriction']?.[0]['enumeration'];
    if (enumerations) {
      const cleanName = cleanTypeName(name);
      dictionaries[cleanName] = enumerations.map((enumVal) => enumVal.$.value);
    }
  });

  return dictionaries;
}

// Funkcja do mapowania typu na wartość ze słownika
function mapToType(cleanType) {
  return typeMapping[cleanType] || 'text'; // Domyślny typ to 'text', jeśli brak w słowniku
}

// Funkcja do generowania struktury JSON dla elementów
function generateJsonForElement(element, dictionaries) {
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

  const children =
    element['xs:complexType']?.[0]['xs:sequence']?.[0]['xs:element'] ||
    element['xsd:complexType']?.[0]['xsd:sequence']?.[0]['xsd:element'] ||
    element['complexType']?.[0]['sequence']?.[0]['element'];

  if (children) {
    jsonElement.children = children.map((child) => generateJsonForElement(child, dictionaries)).filter(Boolean);
  }

  return jsonElement;
}

// Główna funkcja przetwarzająca XSD do JSON
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
  const fakturaElement = elements.find((el) => el.$.name === 'Faktura');
  if (!fakturaElement) {
    throw new Error('Element Faktura nie został znaleziony.');
  }

  const jsonContent = generateJsonForElement(fakturaElement, dictionaries);
  if (!jsonContent) {
    throw new Error('Nie udało się wygenerować struktury JSON.');
  }

  return jsonContent;
};

// Funkcja do pobierania listy dostępnych schematów
export const getSchemas = () => {
  const schemaDir = path.join(__dirname, '../schemas/');
  return fs.readdirSync(schemaDir).filter((file) => file.endsWith('.xsd'));
};
