const Router = require('express').Router();
const api = require('./api.js');
// Set JSON content header
Router.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});
Router.post("/profile", (req, res) => {
    if(req.session.loggedIn) {
        api.getUserById(req.session.id, (err, user) => {
            res.end(JSON.stringify({'success': true, 'user': user}));
        });
    } else {
        res.end(JSON.stringify({'success': false, 'user': null}));
    }
});

module.exports = Router;
