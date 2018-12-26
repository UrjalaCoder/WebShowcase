const containerDOM = $("#gridContainer");
var GRID_WIDTH = 10;
var GRID_HEIGHT = 10;

class Square extends React.Component {

    constructor(props) {
        super(props);
        let isBomb = Math.random() < 0.5;
        this.state = {
            revealed: false,
            isBomb: isBomb,
            position: {
                x: props.xPosition,
                y: props.yPosition
            }
        };

        this.handleClick = this.handleClick.bind(this);
        this.value = "TEST";
    }

    handleClick() {
        this.setState({
            revealed: true,
            isBomb: this.state.isBomb
        });
    }

    render() {
        let displayString = "";
        if(this.state.revealed) {
            displayString = this.value.toString();
        }
        return (<div className="gridSquare" onMouseDown={this.handleClick}>{displayString}</div>);
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
                line.push(<Square xPosition={x} yPosition={y}/>);
            }
            grid.push(line);
        }
        console.log(grid);
        this.status = {'grid': grid};
        // this.initializeSquares();
    }

    initializeSquares() {
        this.status.grid.forEach((row) => {
            row.forEach((square) => {
                console.log(square);
                let value = null;
                if(!square.isBomb) {
                    value = 0;
                    let neighbours = this.getNeighbours(square);
                    neighbours.forEach((n) => {
                        if(n.state.isBomb) {
                            value += 1;
                        }
                    });
                }
                square.value = value;
            });
        });
    }

    getNeighbours(square) {
        var neighbours = [];
        let {x, y} = square.state.position;
        if(x === 0) {
            if(y === 0) {
                neighbours = [this.status.grid[0][1], this.status.grid[1][0], this.status.grid[1][1]];
            } else if(y === GRID_HEIGHT - 1) {
                neighbours = [this.status.grid[y - 1][0], this.status.grid[y - 1][1], this.status.grid[y][1]];
            } else {
                neighbours = [this.status.grid[y - 1][0], this.status.grid[y - 1][1], this.status.grid[y][1],
                                this.status.grid[y + 1][1], this.status.grid[y + 1][0]];
            }
        } else if( x == GRID_WIDTH - 1) {
            if(y === 0) {
                neighbours = [this.status.grid[0][x - 1], this.status.grid[1][x - 1], this.status.grid[1][x]];
            } else if(y === GRID_HEIGHT - 1) {
                neighbours = [this.status.grid[y - 1][x], this.status.grid[y - 1][x - 1], this.status.grid[y][x - 1]];
            } else {
                neighbours = [this.status.grid[y - 1][x], this.status.grid[y - 1][x - 1], this.status.grid[y][x - 1],
                                this.status.grid[y + 1][x - 1], this.status.grid[y + 1][x]]
            }
        } else {
            neighbours = [this.status.grid[y - 1][x - 1], this.status.grid[y - 1][x], this.status.grid[y - 1][x + 1],
                        this.status.grid[y][x - 1], this.status.grid[y][x + 1],
                        this.status.grid[y + 1][x - 1], this.status.grid[y + 1][x], this.status.grid[y + 1][x + 1]];
        }

        return neighbours;
    }

    render() {
        let rows = this.status.grid.map((el) => {
            let elements = el.map((square) => {
                return <td>{square}</td>;
            });

            return <tr>{elements}</tr>;
        });
        return <table><tbody>{rows}</tbody></table>;
    }
}

ReactDOM.render(<Grid/>, document.getElementById("gridContainer"))
