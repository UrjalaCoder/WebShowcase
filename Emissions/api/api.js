'use strict';
const fs = require('fs');
const path = require("path");
const dbConnection = require('./databaseConnection')
const helpers = require('./helpers');

var dataObject = {};
function getData(country, callback) {
    let countryName = helpers.databaseCountryName(country);
    dbConnection.getData(countryName, function(err, data){
        callback(err, data);
    });
}

function addData(country, data) {

}



// Get country names -->
function getKeys(callback) {
    dbConnection.getCountries(function(err, data) {
        // Format country names -->
        let formattedData = data.map((el) => {
            return helpers.formattedCountryName(el);
        });
        formattedData.sort();
        callback(formattedData);
    });
}

module.exports = {
    'getData': getData,
    'getKeys': getKeys
};
