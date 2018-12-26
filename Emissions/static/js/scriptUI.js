var perCapita = false;
const MAX = 6;

// Remove button handler -->
// Removes item from list
function removeItem(target) {
    // Remove spaces add underscore -->
    let countryName = target.dataset.country.split(" ").join("_");
    let list = $("#dataSetList");
    let searchString = `li[data-country="${countryName}"]`;
    list.find(searchString).remove();
    delete shownData[countryName];
    updateGraph();
}



// Add item to list
function addCountryToList(countryName, color) {
    console.log(color);
    let dataList = $("#dataSetList");
    let whiteSpaceCountry = countryName.split(" ").join("_");
    let removeButton = `<button data-country="${countryName}" class="btn btn-danger" onclick="removeItem(this)">Remove</button>`;
    let colorDiv = `<div data-country=${whiteSpaceCountry} class="colorRectangle"></div>`;
    let colorDivElement = $(colorDiv);
    colorDivElement.css("background-color", color.toString());
    let finalElement = `<li class="countryItem" data-country="${whiteSpaceCountry}">${countryName} ${removeButton}</li>`;
    dataList.append($(finalElement));
}

// Add button handler -->
function handleAddButton(button) {
    let spinnerValue = $("#dropDown").val();
    if(!spinnerValue || spinnerValue === "") {
        return;
    }

    let keyName = spinnerValue.split(" ").join("_");
    if(keyName in shownData) {
        console.log("Key already in graph!");
        return;
    }

    if(Object.keys(shownData).length >= MAX) {
        console.log("Too many graphs!");
        return;
    }

    getData(keyName, function(data) {
        shownData[keyName] = data;
        shownData[keyName]['color'] = COLORS[Math.floor(Math.random() * COLORS.length)];
        if(!graph) {
            createGraph();
        }
        addCountryToList(keyName.split("_").join(" "), shownData[keyName]['color']);
        updateGraph();
    });
}

function handlePerCapita(button) {
    perCapita = !perCapita;
    updateGraph();
    $(button).toggleClass("pressed");
}
