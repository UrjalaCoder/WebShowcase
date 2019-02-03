const Router = require('express').Router();
const api = require('./api.js');

// Check if a user is loggedIn
Router.get("/login", (req, res) => {
    if(req.session.loggedIn && req.session.id !== null) {
        api.getUserById(req.session.id, (err, user) => {
            if(err) console.log(err);
            res.end(JSON.stringify({'success': true, 'user': user}));
        });
    } else {
        res.end(JSON.stringify({'success': false, 'user': null}));
    }
});

Router.post("/login", (req, res) => {
    let {username, password} = req.body;
    console.log(req.body);
    api.getUser(username, password, (user, err) => {
        if(err) console.log(err);
        if(user) {
            req.session.id = user.id;
            req.session.loggedIn = true;
            res.end(JSON.stringify({'success': true, 'user': user}));
        } else {
            res.end(JSON.stringify({
                'success': false,
                'user': null,
            }));
        }
    });
});

Router.post("/register", (req, res) => {
    console.log(req.body);
    let {username, password, email} = req.body;
    // First check that the username is not taken.
    api.getUser(username, password, (user, err) => {
        console.log(user);
        if(user) {
            res.end(JSON.stringify({'success': false, 'user': null}));
        } else {
            api.addUser(username, email, password, (err, addedUser) => {
                if(err) console.log("Error: " + err);
                req.session.loggedIn = true;
                req.session.id = addedUser.id;
                console.log(addedUser);
                res.end(JSON.stringify({'success': true, 'user': addedUser}));
            });

        }
    })
});

module.exports = Router;
