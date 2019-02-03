class ListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<li className="listItem"><span className="itemText">{this.props.text}</span> <span className="itemDate">{this.props.date || ""}</span></li>);
    };
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
        let sendData = `text=${encodeURIComponent(this.state.text)}&id=${encodeURIComponent(this.props.user.id)}`
        makeAJAXRequest("POST", "/additem", sendData, (data) => {
            if(data.success === false) {
                console.log("Failed to add item!");
            }
            this.props.addHandler(this.state.text);
        });
    }

    render() {
        let itemInput = <input type="text" value={this.state.itemText} name="item" onChange={this.handleTextChange}></input>;

        return (
            <form id="addForm" action="#" method="post">
                <label for="item">New Item: </label>{itemInput}<br />
                <button onClick={(e) => this.itemAddTry(e)}>Add item</button>
            </form>
        );
    }
}


class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {'items': this.props.user.items};
        this.addItem = this.addItem.bind(this);
    }

    addItem(text) {
        this.setState({'items': this.state.items.concat([text])});
    }

    render() {
        console.log(this.props.user);
        console.log(this.state);
        // if()
        let todoListItems = this.state.items.map((el) => {
            return (<ListItem text={el} date={el.date} />);
        });

        return (
            <div>
                <h4>{this.props.user.name}</h4>
                <ul> {todoListItems} </ul>

                <AddItemBox user={this.props.user} addHandler={this.addItem}/>
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
        console.log(this.state.username);

        let { username, password } = this.state;

        if(username === "" || password === "") {
            return;
        }

        let sendString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password)
        makeAJAXRequest("POST", "/login", sendString, (e) => {
            console.log(e.success);
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

        let usernameInput = <input type="text" value={this.state.username} name="username" onChange={this.handleUsernameChange}></input>;
        let passwordInput = <input type="password" value={this.state.password} name="password" onChange={this.handlePasswordChange}></input>;

        return (
            <form id="loginForm" action="#" method="post">
                <label for="username">Username: </label>{usernameInput}<br />
                <label for="password">Password: </label>{passwordInput}<br />
                <button onClick={(e) => this.loginTry(e)}>Login</button>
            </form>
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

        let usernameInput = <input type="text" value={this.state.username} name="username" onChange={this.handleUsernameChange}></input>;
        let passwordInput = <input type="password" value={this.state.password} name="password" onChange={this.handlePasswordChange}></input>;

        return (
            <form id="loginForm" action="#" method="post">
                <label for="username">Username: </label>{usernameInput}<br />
                <label for="password">Password: </label>{passwordInput}<br />
                <button onClick={(e) => this.registerTry(e)}>Login</button>
            </form>
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

        this.registerHandler = this.registerHandler.bind(this);
        this.loginHandler = this.loginHandler.bind(this);
    }

    loginHandler(user) {
        console.log(user);
        this.setState({'loggedIn': true, 'currentUser': user});
    }

    registerHandler(user) {
        this.setState({'loggedIn': true, 'currentUser': user});
    }

    render() {
        if(this.state.loggedIn && this.state.currentUser) {
            return (<ProfilePage user={this.state.currentUser} />);
        } else {
            return (<div>
                    <LoginBox loginHandler={this.loginHandler}/> <br /> <RegisterBox registerHandler={this.registerHandler} />
                    </div>);
        }
    }
}

ReactDOM.render(<MainComponent />, document.getElementById('root'));
