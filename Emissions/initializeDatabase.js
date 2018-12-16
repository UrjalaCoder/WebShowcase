'use strict';
const fs = require('fs');
const path = require("path");
const dbConnection = require('./api/databaseConnection')
const helpers = require('./api/helpers');

const formattedCountryName = helpers.formattedCountryName;
const databaseCountryName = helpers.databaseCountryName;

// Helper function for parsing the data -->
function parseData(data, data_key) {
    let parsedData = {};
    let lines = data.split("\n");
    lines = lines.splice(5, lines.length);
    lines.forEach(function(line) {
        let lineData = line.split('","');
        lineData = lineData.map(parseQuotationmarks);

        // Remove '/r';
        lineData[lineData.length - 1] = lineData[lineData.length - 1].slice(0, -3);

        let countryName = databaseCountryName(lineData[0]);
        if(countryName === "") {
            return;
        }

        let dataStrings = lineData.slice(4, lineData.length);
        let dataFloats = dataStrings.map((el) => {
            return parseFloat(el);
        });
        let key = data_key.toString();
        parsedData[countryName] = {[key]: dataFloats};
    });

    return parsedData;
}

// Helper function for parsing the data -->
// Removes leading and trailing quotation marks.
function parseQuotationmarks(string) {
    let result = string;
    if(result[0] === '"') {
        result = result.slice(1, result.length);
    }

    if(result[result.length - 1] === '"') {
        result = result.slice(0, result.length - 1);
    }

    return result;
}

// Main function for getting the data -->
function getRawData(filePath, callback) {
    let stream = fs.createReadStream(path.join(__dirname, filePath));
    let data = "";
    stream.on("data", (chunk) => {
        data += chunk.toString("utf8");
    });

    stream.on("end", () => {
        callback(data);
    });
}


function initData(callback) {
    console.log("Initializing database...");

    const populationName = "population_data";
    const emissionsName = "emission_data";

    getRawData("/data/data_emission.csv", (eData) => {
        let emissionData = parseData(eData, emissionsName);
        getRawData("/data/data_population.csv", (pData) => {
            let populationData = parseData(pData, populationName);
            let keys = Object.keys(emissionData);
            let dataObject = {};
            // Combining the data objects -->
            for(var i = 0; i < keys.length; i++) {
                let key = keys[i];
                dataObject[key] = {[emissionsName]: emissionData[key][emissionsName], [populationName]: populationData[key][populationName]};
            }

            console.log("Data parsed!");
            // Initialize the database -->
            dbConnection.init(dataObject, function(result) {
                callback(result);
            });
        });
    });
}

initData(function(result) {
    console.log("Done!");
    return;
});
