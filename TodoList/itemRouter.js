const Router = require('express').Router();
const api = require('./api.js');
// Set JSON content header
Router.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});
Router.post("/additem", (req, res) => {
    let itemText = req.body.text;
    let dateStamp = req.body.dateStamp;
    console.log(req.body);
    if(req.session.loggedIn) {
        api.addItemToUser(itemText, dateStamp, req.session.id, (err) => {
            if(err) {
                res.end(JSON.stringify({'success': false}));
            }
            res.end(JSON.stringify({'success': true}));
        });
    }
});

Router.post("/removeitem", (req, res) => {
    console.log("TEST!");
    let {text, dateStamp} = req.body;
    console.log("TEST2");
    console.log(req.body);
    if(req.session.loggedIn) {
        console.log("LoggedIn");
        api.removeItem(text, dateStamp, req.session.id, (err) => {
            if(err) {
                console.log(err);
                res.end(JSON.stringify({'success': false}));
            }

            res.end(JSON.stringify({'success': true}));
        });
    }
});

module.exports = Router;
