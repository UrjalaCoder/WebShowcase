'use strict';
function databaseCountryName(country) {
    let result = country;
    while(result.includes(".")) {
        result = result.replace(".", "?");
    }

    result = result.split(" ").join("_");
    return result;
}

function formattedCountryName(country) {
    let result = country;
    while(result.includes("?")) {
        result = result.replace("?", ".");
    }

    result = result.split("_").join(" ");
    return result;
}

module.exports = {
    'databaseCountryName': databaseCountryName,
    'formattedCountryName': formattedCountryName
};
