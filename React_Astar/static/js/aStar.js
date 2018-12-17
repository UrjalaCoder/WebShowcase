const containerDOM = $("#gridContainer");
var GRID_WIDTH = 10;
var GRID_HEIGHT = 10;

class Square extends React.Component {

    constructor(props) {
        super(props);
        this.position = {
            x: props.xPosition,
            y: props.yPosition
        };
        let isBomb = Math.random() < 0.5;
        this.state = {
            revealed: false,
            isBomb: isBomb
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log("TEST!");
        this.setState({
            revealed: true,
            isBomb: this.state.isBomb
        });
    }

    render() {
        let displayString = "";
        if(this.state.revealed) {
            displayString = this.state.isBomb.toString();
        }
        return (<div className="gridSquare" onClick={this.handleClick}>{displayString}</div>);
    }
}


class Grid extends React.Component {
    constructor(props) {
        super(props);

        // Generate grid -->
        let grid = [];
        for(let y = 0; y < GRID_HEIGHT; y++) {
            let line = [];
            for(let x = 0; x < GRID_WIDTH; x++) {
                line.push(<Square xPosition={x} yPosition={y}></Square>);
            }
            grid.push(line);
        }
        this.status = {'grid': grid};
    }

    render() {
        let rows = this.status.grid.map((el) => {
            let elements = el.map((square) => {
                return <td>{square}</td>;
            });

            return <tr>{elements}</tr>;
        });
        console.log(rows);
        return <table><tbody>{rows}</tbody></table>;
    }
}

ReactDOM.render(<Grid></Grid>, document.getElementById("gridContainer"))
