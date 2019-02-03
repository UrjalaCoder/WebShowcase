const Router = require('express').Router();
const api = require('./api.js');
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
