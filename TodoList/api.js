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

const client = new MongoClient(url);

function addItemToUser(text, id, callback) {
    getUserById(id, (err, user) => {
        if(err) callback(err)
        console.log(user);
        user['items'].push(text);
        client.connect(function(err, db) {
            const database = db.db("tehtavadb");
            database.collection("Users").updateOne({'id': id}, {$set: {'items': user['items']}}, null, (err, res) => {
                callback(err);
            });
        });
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
    'addItemToUser': addItemToUser
};
