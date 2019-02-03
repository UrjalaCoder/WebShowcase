const MongoClient = require('mongodb').MongoClient;
const uuid = require('uuid/v4');
const crypto = require('crypto');
const url = "mongodb://root:r00t12@ds247290.mlab.com:47290/tehtavadb";

// Create a new 'User' object.
// Hash the password;
class User {
    constructor(name, password, email) {
        this.id = uuid();
        this.name = name;
        this.email = email;
        this.timeStamp = Date.now().toString();
        this.passwordHash = User.Hash(password, this.timeStamp);
        this.items = [];
    }

    // Returns the hashed password. Hash is done using the raw password and a timeStamp.
    static Hash(string, timeStamp) {
        // Create a new 'hash' object every time.
        const hash = crypto.createHash('sha512');
        hash.update(string, 'utf8');
        hash.update(timeStamp, 'utf8');
        return hash.digest('hex');
    }
}

function Item(text, dateStamp) {
    this.text = text;
    this.dateStamp = dateStamp;
}

const client = new MongoClient(url);

function updateItemArr(newArr, userId, callback) {
    console.log(newArr);
    getUserById(userId, (err, user) => {
        if(err) callback(err)
        user['items'] = newArr;
        client.connect(function(err, db) {
            const database = db.db("tehtavadb");
            database.collection("Users").updateOne({'id': userId}, {$set: {'items': user['items']}}, null, (err, res) => {
                callback(err, user);
            });
        });
    });
}

function getItemArr(userId, callback) {
    getUserById(userId, (err, user) => {
        if(err) callback(err);
        callback(null, user['items']);
    });
}

function addItemToUser(text, dateStamp, id, callback) {
    getItemArr(id, (err, itemArr) => {
        if(err) callback(err);

        let arr = itemArr.concat([new Item(text, dateStamp)]);
        updateItemArr(arr, id, callback);
    });
}

function removeItem(text, dateStamp, id, callback) {
    getUserById(id, (err, user) => {
        if(err) callback(err)
        console.log(user);
        let index = -1;
        for(let i = 0; i < user['items'].length; i++) {
            if(user['items'][i].text === text && user['items'][i].dateStamp === dateStamp) {
                index = i;
            }
        }
        if(index !== -1) {
            user['items'].splice(index, 1);
            console.log(user['items']);
            updateItemArr(user['items'], id, callback);
        }
    });
}

function getUserById(id, callback) {
    client.connect(function(err, db) {
        const dbo = db.db("tehtavadb");
        dbo.collection("Users").find({id: id}).toArray(function(err, res) {
            if(err) {
                callback(err);
                return;
            }
            callback(null, res[0]);
        });
    });
}

function getUser(name, password, callback) {
    // Callback has args (res, err)
    client.connect(function(err, db) {
      if (err) console.log(err);
      // First find all whose name is the same as 'name'.
      const dbo = db.db("tehtavadb");
      dbo.collection("Users").find({name: name}).toArray(function(err, res) {
        if (err) {
            callback(err);
            return;
        }
        let matches = res;
        if(matches.length <= 0) {
            callback(null);
            return;
        }

        // Then go trough all the matches. Find one whose 'passwordHash' is the same as the provided 'password' hashed with the match's 'timeStamp'.
        for(user of matches) {
            let {timeStamp, passwordHash} = user;
            if(User.Hash(password, timeStamp) === passwordHash) {
                callback(user);
                return;
            }
        }
        callback(null);
        return;
      });

    });
}

function addUser(name, email, password, callback) {
    let newUser = new User(name, password, email);
    let id = newUser.id;
    console.log("Trying to add user!");
    client.connect((err, database) => {
        console.log("Trying connection");
        if(err) console.log("Connection error" + err);
        const dbo = database.db("tehtavadb");
        dbo.collection("Users").insertOne(newUser, (err, res) => {
            if(err) callback(err);
            callback(null, newUser);
            // database.close();
            return;
        });
    })
}

module.exports = {
    'addUser': addUser,
    'getUser': getUser,
    'getUserById': getUserById,
    'addItemToUser': addItemToUser,
    'removeItem': removeItem
};
