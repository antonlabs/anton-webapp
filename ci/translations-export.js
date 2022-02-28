const axios = require('axios');
const fs = require('fs');
const executeSync = require('child_process').execSync;
const FormData = require('form-data');
const AWS = require('aws-sdk');

/**
 node translations-export.js ./src/locale/
 **/

const localeFolder = process.argv[2];

let API_TOKEN;
let PROJECT_ID;
const PO_EDITOR_URL = 'https://api.poeditor.com/v2';

const updateLocalLanguage = async (language) => {
  const formData = new FormData();
  formData.append('api_token', API_TOKEN);
  formData.append('id', PROJECT_ID);
  formData.append('language', language);
  formData.append('type', 'xliff');
  const response = await axios.post(PO_EDITOR_URL + '/projects/export', formData, {
    headers: {
      ...formData.getHeaders()
    }
  });
  console.log('Getting xlf file -> ', response.data);
  if(response.data.result.url) {
    const file = await axios.get(response.data.result.url, {responseType: 'stream'});
    const writer = fs.createWriteStream(localeFolder + 'messages.' + language + '.xlf');
    file.data.pipe(writer);
    await new Promise((resolve, reject) => {
      file.data.on('end', () => {
        console.log('Get language ' +  language + ' success');
        resolve()
      })

      file.data.on('error', (error) => {
        console.log('Get language ' +  language + ' error');
        reject(error)
      })
    });
  }
}

const getCurrentLanguageCodes = async () => {
  const formData = new FormData();
  formData.append('api_token', API_TOKEN);
  formData.append('id', PROJECT_ID)
  const response = await axios.post(PO_EDITOR_URL + '/languages/list', formData, {
    headers: {
      ...formData.getHeaders()
    }
  });
  console.log(response.data);
  return response.data.result.languages.map(item => item.code);
};


const updateTerms = async () => {
  const formData = new FormData();
  formData.append('api_token', API_TOKEN);
  formData.append('id', PROJECT_ID);
  formData.append('updating', 'terms_translations');
  formData.append('language', 'en');
  formData.append('read_from_source', 1);
  formData.append('overwrite', 0);
  formData.append('file', fs.createReadStream(localeFolder + 'messages.xlf'));
  console.log('Uploading terms definitions');
  const response = await axios.post(PO_EDITOR_URL + '/projects/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...formData.getHeaders()
    }
  });
  console.log('Upload finish', response.data);
};

(async () => {
  const secret = await new AWS.SecretsManager().getSecretValue({SecretId: 'arn:aws:secretsmanager:eu-west-1:682060008544:secret:poeditor-PIFC7v'}).promise();
  const secretObj = JSON.parse(secret.SecretString);
  API_TOKEN = secretObj.api_token;
  PROJECT_ID = secretObj.project;
  const languages = await getCurrentLanguageCodes();
  console.log('LANGUAGE founds: ' + languages.join(', '));
  try{
    await Promise.all(languages.map(async (lang) => await updateLocalLanguage(lang)));
  }catch (e) {
    console.error(e);
  }
  executeSync('ng extract-i18n --output-path ' + localeFolder); //extract messages
  for (const lang of languages) {
    if(lang !== 'en' && fs.statSync(`${localeFolder}/messages.${lang}.xlf`).size === 0) {
      console.log('Find translation file for lang ' + lang + 'empty,  extracting it from code sources');
      fs.createReadStream(localeFolder + 'messages.xlf').pipe(fs.createWriteStream(localeFolder + '/messages.' + lang + '.xlf'));
    }
  }
  await updateTerms();
})()
