'use strict';
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const api = require('./api/api');
const helpers = require('./api/helpers');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set("view engine", 'handlebars');

app.use("/static", express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
    api.getKeys(function(keys) {
        res.render('home', {title: '|Home|', countries: keys});
    });
});

// TEST

app.get("/data/:country", (req, res) => {
    let name = req.params.country;
    api.getData(name, function(err, data) {
        if(err) {
            console.log("Error: " + err);
            res.send("Internal server error!");
        }
        res.send(JSON.stringify(data));
    });
});

// First handle data -->
app.listen(3000, function() {
    console.log("Started!");
});
