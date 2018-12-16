'use strict';
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://root:r00t_user@ds253243.mlab.com:53243/reaktortyodb";
const dbNAme = "reaktortyodb";
const collectionName = "Reaktortyo";

const client = new MongoClient(url);

function init(data, callback) {
    client.connect(function(err) {
        if(err) {
            callback(err);
        } else {
            const db = client.db(dbNAme);
            const collection = db.collection(collectionName);
            let countries = Object.keys(data);
            let dataArray = [];
            for(var i = 0; i < countries.length; i++) {
                let population = data[countries[i]]['population_data'];
                let emissions = data[countries[i]]['emission_data'];
                dataArray.push({
                    'country': countries[i],
                    'data': {'population_data': population, 'emission_data': emissions}
                });
            }

            collection.insertMany(dataArray, function(err, result) {
                if(err) {
                    callback(err);
                } else {
                    client.close();
                    callback(result);
                }
            });
        }
    }, {
        useNewUrlParser: true
    });
}

function getCountries(callback) {
    client.connect(function(err) {
        if(err) {
            callback(err);
        } else {
            const db = client.db(dbNAme);
            const collection = db.collection(collectionName);
            let data = collection.find({}).toArray(function(err, data) {
                let countries = [];
                data.forEach((el) => {
                    countries.push(el['country']);
                });
                callback(err, countries);
            });
        }
    });
}

function getData(country, callback) {
    client.connect(function(err) {
        if(err) {
            callback(err);
        } else {
            const db = client.db(dbNAme);
            const collection = db.collection(collectionName);

            let searchObject = {
                "country": country
            };
            let result = collection.findOne(searchObject, function(err, data) {
                callback(err, data);
            });
        }
    });
}


module.exports = {
    'init': init,
    'getCountries': getCountries,
    'getData': getData
};
