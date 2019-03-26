var to_json = require('xmljson').to_json;
const translate = require('google-translate-api');
var to_xml = require('xmljson').to_xml;
const fs = require('fs');
var jsonData = require('./inputFiles/en.json');
let toLanguage = 'hi'; //the language that the text needs to be converted into
let dataFormat = 'xml'; //the format of the input file supported formats are xml and json
if ('xml' === dataFormat) {
    fs.readFile('./inputFiles/strings.xml', function (err, xml) {
        to_json(xml, function (error, fileData) {
            // -> { prop1: 'val1', prop2: 'val2', prop3: 'val3' }
            translateWordsInXmlFile(fileData).then(translatedData => {
                let translatedDataInString = JSON.stringify(translatedData);
                to_xml(translatedDataInString, function (error, translatedDataReconvertedtoXml) {
                    // Module returns an XML string
                    writeConvertedDataToFile(translatedDataReconvertedtoXml);
                });
            });
        });
    });
}

async function translateWordsInXmlFile(fileData) {
    for (stringData in fileData['resources']['string']) {
        fileData['resources']['string'][stringData]['_'] = await translator(fileData['resources']['string'][stringData]['_']);
    }
    return fileData;
}

function translator(word) {
    return new Promise((resolve, reject) => {
        translate(word, {
            to: toLanguage
        }).then(res => {
            resolve(res.text);
        }).catch(err => {
            console.error(err);
            reject(err);
        });

    });
}

function writeConvertedDataToFile(newData) {
    fs.writeFile(toLanguage + '.' + dataFormat, JSON.stringify(newData), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}