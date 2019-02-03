const express = require('express');
const http = require('http');
const path = require('path');
const exhbs = require('express-handlebars');
const bParser = require('body-parser');
const cookieSession = require('cookie-session');

// Own modules -->
const loginRouter = require('./loginRouter.js');
const profileRouter = require('./profileRouter.js');
const itemRouter = require('./itemRouter');


let app = express();
// Configure expres middleware -->
app.use(bParser.json());
app.use(bParser.urlencoded({ extended: true }));

// Session cookies -->
app.use(cookieSession({
    'name': 'session',
    'secret': 'mySecret',
    'maxAge': 1 * 60 * 60 * 1000
}));

// Static files -->
app.use(express.static(path.join(__dirname, "static")));

//  Login router -->
app.use(loginRouter);

// Profile router -->
app.use(profileRouter);

// Item handler router -->
app.use(itemRouter);

// Index login page -->
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

let server = http.createServer(app);
server.listen(3000, () => {
    console.log("Server started at 3000...");
});
