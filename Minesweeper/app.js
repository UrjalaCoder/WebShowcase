const express = require('express');
const fs = require('fs');
const path = require('path');
var app = express();


app.use("/static", express.static(path.join(__dirname, "static")))
// Index file
app.get("/", function(req, res) {
    var stream = fs.createReadStream(path.join(__dirname, "/views/index.html"));
    stream.pipe(res);
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started!");
});
