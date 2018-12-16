'use strict';
function finalizeNavbar() {
    let navBarItems = $(".navBarItem");
    let fileName = window.location.pathname;
    for(item of navBarItems) {
        if(item.text.toLowerCase() === fileName || (fileName === "/") && item.text.toLowerCase() === "home") {
            $(item).parent().addClass("active");
            return;
        }
    }
}
finalizeNavbar();

const COLORS = ['rgba(145, 60, 205, 0.6)', 'rgba(241, 95, 116, 0.6)', 'rgba(247, 109, 60, 0.6)', 'rgba(44, 168, 194, 0.6)', 'rgba(152, 203, 74, 0.6)', 'rgba(84, 129, 230, 0.6)'];
var shownData = {};
var graph;
var dataKey = "emissions";
var perCapita = false;

function removeItem(target) {
    // Remove spaces add underscore -->
    let countryName = target.dataset.country.replace(" ", "_");
    let list = $("#dataSetList");
    removeCountry(countryName);

    let searchString = `li[data-country="${countryName}"]`;
    list.find(searchString).remove();
}

function addUnderscore(string) {
    let result = string;
    while(result.includes(" ")) {
        result = result.replace(" ", "_");
    }

    return result;
}

function addCountryToList(countryName) {
    let dataList = $("#dataSetList");
    let whiteSpaceCountry = addUnderscore(countryName);
    let removeButton = `<button data-country="${countryName}" onclick="removeItem(this)">Remove</button>`;
    let finalElement = `<li class="countryItem" data-country="${whiteSpaceCountry}">${countryName} ${removeButton}</li>`;
    dataList.append($(finalElement));
}

function handleAddButton(button) {
    let spinnerValue = $("#dropDown").val();
    // Initial checks -->
    if(!spinnerValue || spinnerValue == "") {
        return;
    }

    // Just remove the spaces -->
    let urlCountry = spinnerValue.split(" ").join("_");

    if(urlCountry in shownData) {
        alert("Already in data!");
        return;
    }

    getData(urlCountry, (data) => {
        shownData[urlCountry] = data;
        addCountryToList(spinnerValue);
        if(!graph) {
            createGraph();
            addData(urlCountry);
        } else {
            addData(urlCountry);
        }
    });
}

function getData(country, callback) {
    $.ajax({
        url: `/data/${country}`
    }).done((data) => {
        data = JSON.parse(data);
        callback({'population': data['data']['population_data'], 'emissions': data['data']['emission_data']});
    });
}

function addData(country) {
    let colors = pickColor(Object.keys(shownData).length - 1, (2017-1960+1));
    let formattedCountry = country.split("_").join(" ");

    let data = shownData[country][dataKey];
    if(perCapita) {
        data = data.map((el, index) => {
            let population = shownData[country]['population'][index];
            if(!el || !population) {
                return null;
            } else {
                return el / population;
            }
        });
    }

    graph.data.datasets.push({
        label: `${formattedCountry} ${dataKey}`,
        data: data,
        borderColor: colors[0],
        country: country
    });

    graph.update();
}

function removeCountryFromGraph(countryName) {

}

// Removes country from graph and shownData object -->
function removeCountry(countryName) {
    while (countryName.includes(" ")) {
        countryName = countryName.replace(" ", "_");
    }
    // Test -->
    if(countryName === "") {
        return;
    }

    delete shownData[countryName];

    let deleteIndex = -1;
    for(let i = 0; i < graph.data.datasets.length; i++) {
        let dataset = graph.data.datasets[i];
        if(dataset.country === countryName) {
            deleteIndex = i;
            break;
        }
    }

    if(deleteIndex !== -1) {
        graph.data.datasets.splice(deleteIndex, 1);
        graph.update();
    }
}

function pickColor(possibleIndex, arraySize) {
    let index = possibleIndex;
    if(possibleIndex >= COLORS.length) {
        index = Math.floor(Math.random() * COLORS.length);
    }

    let resultArray = Array(arraySize);
    resultArray.fill(COLORS[index]);
    return resultArray;
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
