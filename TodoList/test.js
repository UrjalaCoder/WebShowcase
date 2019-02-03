const api = require('./api.js');

api.addItemToUser("test", "2b975368-f0b7-4784-91e6-2381de6ad0bc", (data) => {
    console.log(data);
});
