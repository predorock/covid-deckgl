const csvToJson = require('convert-csv-to-json');
const path = require('path');
const fs = require('fs');
const fsx = require('fs-extra');
const moment = require('moment');

const inputDir = './data/dati-province';
const outputDir = './public/data';

const ignore = [
    'dpc-covid19-ita-province.csv'
];

function convert(input, output) {
    csvToJson
        .fieldDelimiter(',')
        .formatValueByType()
        .generateJsonFileFromCsv(input, output);
}

function getJSON(input) {
    return csvToJson
        .fieldDelimiter(',')
        .formatValueByType()
        .getJsonFromCsv(input);
}

const directoryPath = path.join(__dirname, inputDir);

fsx.ensureDir(outputDir);

console.log(
    ignore.map(s => 'Ignoring: ' + s).join('\n')
);

fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    const sources = [];
    files
        .filter(f => ignore.indexOf(f) === -1)
        .forEach(function (file) {
        // Do whatever you want to do with the file
        const input = path.join(__dirname, inputDir, file);
        const outName = file.substr(0, file.lastIndexOf(".")) + ".json";
        const output = path.join(__dirname, outputDir, outName);
        const json = getJSON(input);
        const mDate = moment(json[0].data, 'YYYY-MM-DD HH:mm:ss', 'it', true);
        sources.push({
            data: mDate.format('LL'),
            name: outName,
            date: mDate.date()
        });
        fs.writeFileSync(output, JSON.stringify(json),{encoding: 'utf8'});
        console.log(`File ${input} converted!`);
    });

    fs.writeFileSync(path.join(__dirname, outputDir, 'sources.json'), JSON.stringify(sources),{encoding: 'utf8'})
});
