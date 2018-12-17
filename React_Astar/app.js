const express = require('express');
const fs = require('fs');
const path = require('path');
var app = express();

// Index file
app.get("/", function(req, res) {
    var stream = fs.createReadStream(path.join(__dirname, "/views/index.html"));
    stream.pipe(res);
});

app.listen(3000, function() {
    console.log("Server started at port '3000'...");
});
