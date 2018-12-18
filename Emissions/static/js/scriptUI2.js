'use strict';
const COLORS = ['rgba(145, 60, 205, 0.6)', 'rgba(241, 95, 116, 0.6)', 'rgba(247, 109, 60, 0.6)', 'rgba(44, 168, 194, 0.6)', 'rgba(152, 203, 74, 0.6)', 'rgba(84, 129, 230, 0.6)'];
var shownData = {};
var graph;
var emissionKey = "emissions";
var populationKey = "population";


// Updates the graph to reflect the shownData object -->
// Returns nothing.
function updateGraph() {
    // If graph is not initialized, return.
    if(!graph) {
        return;
    }
    // Set datasets to empty list -->
    let newDatasets = [];
    for(let key in shownData) {
        // If key is a country -->
        if(shownData.hasOwnProperty(key)) {
            let data = [];
            shownData[key][emissionKey].forEach((element, index) => {
                if(!element) {
                    data.push(null);
                } else if(perCapita && !shownData[key][populationKey]) {
                    data.push(null);
                } else {
                    let point = element;
                    if(perCapita) {
                        point = element / shownData[key][populationKey][index];
                        console.log(point);
                    }
                    data.push(point);
                }
            });
            let formattedName = key.split("_").join(" ");
            newDatasets.push({
                label: `${formattedName} emissions`,
                data: data,
                borderColor: shownData[key]['color'],
                country: key
            });
        }

    }
    graph.data.datasets = newDatasets;
    graph.update();
}


// Add item to list
function addCountryToList(countryName) {
    let dataList = $("#dataSetList");
    let whiteSpaceCountry = countryName.split(" ").join("_");
    let removeButton = `<button data-country="${countryName}" onclick="removeItem(this)">Remove</button>`;
    let finalElement = `<li class="countryItem" data-country="${whiteSpaceCountry}">${countryName} ${removeButton}</li>`;
    dataList.append($(finalElement));
}

function getData(country, callback) {
    $.ajax({
        url: `/data/${country}`
    }).done((data) => {
        data = JSON.parse(data);
        callback({
            [populationKey]: data['data']['population_data'],
            [emissionKey]: data['data']['emission_data']
        });
    });
}

function createGraph() {
    let canvas = $('#graphCanvas');
    let yearLabels = [];
    for(var i = 0; i < (2017 - 1960 + 1); i++) {
        yearLabels.push((1960 + i).toString());
    }

    graph = new Chart(canvas, {
        type: 'line',
        data: {
            labels: yearLabels,
            datasets: []
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
