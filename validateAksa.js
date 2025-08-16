const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');
const path = require('path');

const ajv = new Ajv();
addFormats(ajv);

const schemaPath = path.join(__dirname, 'frontend/public/data/investment.schema.json');
const dataPath = path.join(__dirname, 'frontend/public/data/investments.json');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const aksaData = data.find(item => item.id === 'aksa-akrilik-kimya-sanayii-as');

if (!aksaData) {
  console.log('Could not find the entry for "aksa-akrilik-kimya-sanayii-as" in investments.json');
  return;
}

const validate = ajv.compile(schema);
const valid = validate(aksaData);

if (!valid) {
  console.log('Validation errors for "aksa-akrilik-kimya-sanayii-as":', validate.errors);
} else {
  console.log('"aksa-akrilik-kimya-sanayii-as" is valid according to the schema.');
}
