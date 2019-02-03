const Router = require('express').Router();
const api = require('./api.js');
Router.post("/additem", (req, res) => {
    let itemText = req.body.text;
    console.log(req.body);
    if(req.session.loggedIn) {
        api.addItemToUser(itemText, req.body.id, (err) => {
            if(err) {
                res.end(JSON.stringify({'success': false}));
            }
            res.end(JSON.stringify({'success': true}));
        });
    }
});

module.exports = Router;
