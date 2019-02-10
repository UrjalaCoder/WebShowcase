const listItem = function(text) {
    this.text = text;
    this.dateStamp = Date.now();
}

class AddItemBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {'text': ""};

        this.handleTextChange = this.handleTextChange.bind(this);
        this.itemAddTry = this.itemAddTry.bind(this);
    }

    handleTextChange(e) {
        this.setState({'text': e.target.value});
    }

    itemAddTry(e) {
        e.preventDefault();
        let dStamp = Date.now();
        let sendData = `text=${encodeURIComponent(this.state.text)}&id=${encodeURIComponent(this.props.user.id)}&dateStamp=${encodeURIComponent(dStamp)}`
        makeAJAXRequest("POST", "/additem", sendData, (data) => {
            if(data.success === false) {
                console.log("Failed to add item!");
            }
            this.props.addHandler(this.state.text, dStamp);
        });
    }

    render() {
        let itemInput = <input type="text" className="form-control" value={this.state.itemText} name="item" onChange={this.handleTextChange}></input>;

        return (
            <form id="addForm" action="#" method="post">
                <div className="form-group">
                    <label for="item">New Item: </label>{itemInput}
                    <small className="form-text text-muted">Enter whatever you want to add to list.</small>
                    <button onClick={(e) => this.itemAddTry(e)} className="btn btn-primary">Add item</button>
                </div>
            </form>
        );
    }
}


class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {'items': this.props.user.items};
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    addItem(text, dateStamp) {
        let addedItem = new listItem(text);
        addedItem.dateStamp = dateStamp;
        this.setState({'items': this.state.items.concat([addedItem])});
    }

    removeItem(el) {
        let {text, date} = el.target.dataset;
        let deleteObj = new listItem(text);
        deleteObj.dateStamp = date;
        let deletedArr = this.state.items.slice();
        let index = -1;
        for(let i = 0; i < deletedArr.length; i++) {
            if(deletedArr[i].text === deleteObj.text && deletedArr[i].dateStamp.toString() === deleteObj.dateStamp) {
                index = i;
            }
        }
        if(index !== -1) {
            deletedArr.splice(index, 1);
        } else {
            console.log("No such element!");
        }
        console.log("DeletedArr: ");
        console.log(deletedArr);
        this.setState({'items': deletedArr.slice()});

        console.log("Items: ");
        console.log(this.state.items);
        let encodedString = `text=${encodeURIComponent(text)}&dateStamp=${encodeURIComponent(date)}`;
        makeAJAXRequest("POST", "/removeitem", encodedString, (res, user) => {

        });
    }

    render() {
        // if()
        let todoListItems = this.state.items.map((el) => {
            let date = new Date(parseInt(el.dateStamp));
            console.log(date);
            let dateString = date.toLocaleString();

            return (
            <li onClick={this.removeItem} data-date={el.dateStamp} data-text={el.text} className="list-group-item">
                {el.text}
                <small className="dateContainer">{dateString}</small>
            </li>);
        }, this);

        return (
            <div className="jumbotron">
                <button onClick={this.props.logOutHandler} className="btn btn-secondary">Log out</button>
                <h4 id="usernameHeader">{this.props.user.name}</h4>
                <AddItemBox user={this.props.user} addHandler={this.addItem}/>
                <br />
                <ul class="list-group" id="todoList"> {todoListItems} </ul>
            </div>
        );
    }
}

function makeAJAXRequest(method, url, sendString, dataHandler) {

    let request = new XMLHttpRequest();

    request.open(method, url);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.addEventListener("load", () => {
        let data = JSON.parse(request.responseText);
        dataHandler(data);
    });
    request.send(sendString);
}

class LoginBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {'username': "", 'password': ""};

        this.loginTry = this.loginTry.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    loginTry(event) {
        event.preventDefault();

        let { username, password } = this.state;

        if(username === "" || password === "") {
            return;
        }

        let sendString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password)
        makeAJAXRequest("POST", "/login", sendString, (e) => {
            if(e.success) {
                this.props.loginHandler(e.user);
            }
        });
    }

    handleUsernameChange(e) {
        this.setState({'username': e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({'password': e.target.value});
    }

    render() {

        let usernameInput = <input type="text" className="form-control" value={this.state.username} name="username" onChange={this.handleUsernameChange}></input>;
        let passwordInput = <input type="password" className="form-control" value={this.state.password} name="password" onChange={this.handlePasswordChange}></input>;

        return (
            <div className="jumbotron">
            <h4>Login</h4>
            <div className="form-group">
            <form id="loginForm" action="#" method="post">
                    <label for="username">Username: </label>{usernameInput}<br />
                    <label for="password">Password: </label>{passwordInput}<br />
                    <button className="btn btn-primary" onClick={(e) => this.loginTry(e)}>Login</button>
            </form>
            </div>
            </div>
        );
    }
}

class RegisterBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {'username': "", 'password': ""};

        this.registerTry = this.registerTry.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    registerTry(event) {
        event.preventDefault();

        let { username, password } = this.state;

        if(username === "" || password === "") {
            return;
        }

        let sendString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password)
        makeAJAXRequest("POST", "/register", sendString, (e) => {
            console.log("Made request!");
            if(e.success) {
                this.props.registerHandler(e.user);
            }
        });
    }

    handleUsernameChange(e) {
        this.setState({'username': e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({'password': e.target.value});
    }

    render() {

        let usernameInput = <input type="text" className="form-control" value={this.state.username} name="username" onChange={this.handleUsernameChange}></input>;
        let passwordInput = <input type="password"className="form-control" value={this.state.password} name="password" onChange={this.handlePasswordChange}></input>;

        return (
            <div className="jumbotron">
            <h4>Register a new account</h4>
            <div className="form-group">
                <form id="loginForm" action="#" method="post">
                    <label for="username">Username: </label>{usernameInput}<br />
                    <label for="password">Password: </label>{passwordInput}<br />
                    <button className="btn btn-primary" onClick={(e) => this.registerTry(e)}>Register</button>
                </form>
            </div>
            </div>
        );
    }
}

class MainComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {'loggedIn': false, 'currentUser': null};
        makeAJAXRequest("GET", "/login", "", (data) => {
            if(data.success) {
                this.setState({'loggedIn': true, 'currentUser': data.user});
            }
        });

        this.userUpdateHandler = this.userUpdateHandler.bind(this);
        this.logOutHandler = this.logOutHandler.bind(this);
    }


    userUpdateHandler(user) {
        this.setState({'loggedIn': true, 'currentUser': user});
    }

    logOutHandler(e) {
        e.preventDefault();
        makeAJAXRequest("POST", "/logout", "", (res) => {
            if(!res.success) console.log("Error logging out!");
            this.setState({'loggedIn': false, 'currentUser': null});
        });
    }

    render() {
        if(this.state.loggedIn && this.state.currentUser) {
            return (<div className="container"><ProfilePage user={this.state.currentUser} logOutHandler={this.logOutHandler} userHandler={this.userUpdateHandler} /></div>);
        } else {
            return (<div className="container">
                    <LoginBox loginHandler={this.userUpdateHandler}/> <br /> <RegisterBox registerHandler={this.userUpdateHandler} />
                    </div>);
        }
    }
}

ReactDOM.render(<MainComponent />, document.getElementById('root'));
