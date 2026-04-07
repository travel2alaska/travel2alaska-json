import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { globSync } from 'glob';

// Initialize AJV
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const baseDir = path.join(__dirname, '..');
const schemasDir = path.join(baseDir, 'schemas');
const dataDir = path.join(baseDir, 'data');

// Load and compile all schemas
const schemaFiles = globSync('*.schema.json', { cwd: schemasDir });
const validators: Record<string, any> = {};

schemaFiles.forEach((file) => {
  try {
    const schemaContent = JSON.parse(fs.readFileSync(path.join(schemasDir, file), 'utf8'));
    // The key is the schema type based on filename, e.g., destination.schema.json -> destination
    const schemaKey = file.split('.')[0];
    validators[schemaKey] = ajv.compile(schemaContent);
    console.log(`Loaded schema: ${file}`);
  } catch (err) {
    console.error(`Failed to load schema ${file}:`, err);
    process.exit(1);
  }
});

let hasErrors = false;

// Validate data files against their respective schemas
// We assume data folder structure corresponds to schema name
// e.g. data/destinations/*.json uses destination.schema.json
const dataMaps: Record<string, string> = {
  'destinations': 'destination',
  'events': 'event',
  'listings': 'listing',
  'faqs': 'faq',
  'itineraries': 'itinerary',
  'best-of': 'best-of'
};

Object.entries(dataMaps).forEach(([folder, schemaKey]) => {
  const validator = validators[schemaKey];
  if (!validator) {
    console.warn(`No validator compiled for folder ${folder} (expected ${schemaKey})`);
    return;
  }

  const folderPath = path.join(dataDir, folder);
  if (!fs.existsSync(folderPath)) return;

  const dataFiles = globSync('**/*.json', { cwd: folderPath });

  dataFiles.forEach((file) => {
    const filePath = path.join(folderPath, file);
    try {
      const dataContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      // If the file is an array, validate each item (used for listings like charters.json)
      const dataItems = Array.isArray(dataContent) ? dataContent : [dataContent];
      
      dataItems.forEach((item, idx) => {
        const valid = validator(item);
        if (!valid) {
          hasErrors = true;
          console.error(`\u274c Validation failed for ${folder}/${file}${Array.isArray(dataContent) ? ` [Index ${idx}]` : ''}`);
          console.error(ajv.errorsText(validator.errors));
        } else {
          console.log(`\u2705 Validated ${folder}/${file}`);
        }
      });
    } catch (err: any) {
      hasErrors = true;
      console.error(`\u274c Failed to read/parse ${folder}/${file}:`, err.message);
    }
  });
});

if (hasErrors) {
  console.error('\n\u274c Validation Failed. Fix upstream data before deploying.');
  process.exit(1);
} else {
  console.log('\n\u2705 All Data Validated Successfully.');
}
