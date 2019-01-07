class Square extends React.Component {
    render() {
        let classes = ['gridSquare'];
        // Display either empty string or something else.
        let displayValue = "";
        if(this.props.isRevealed && this.props.value > 0 && !this.props.isMine) {
            classes.push('revealedSquare');
            displayValue = this.props.value;
        } else if(!this.props.isRevealed && this.props.isFlagged){
            classes.push('flaggedSquare');
            displayValue = "F";
        } else if(this.props.isRevealed && this.props.isMine){
            classes.push('bombSquare');
        } else if(this.props.isRevealed){
            classes.push('revealedSquare');
        }
        let classList = classes.join(" ");
        return (<div className={classList} onClick={this.props.clickEvent} onContextMenu={this.props.cMenuEvent}>{displayValue}</div>);

    }
}

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'grid': this.initializeGrid(),
            'flaggedCounter': 0,
            'success': false
        };
    }

    handleContextMenu(e, x, y) {
        let data = this.state.grid;
        if(data[y][x].isRevealed) {
            return null;
        }

        let counter = this.state.flaggedCounter;
        if(data[y][x].isFlagged) {
            counter = counter - 1;
        } else {
            counter = counter + 1;
        }

        data[y][x].isFlagged = !(data[y][x].isFlagged);

        let success = this.state.success;
        if(counter == this.props.mineCount) {
            success = this.checkFlagPositions(data);
        }

        if(success) {
            alert("You won!");
        }

        e.preventDefault();
        this.setState({'grid': data, 'flaggedCounter': counter, 'success': success});
    }

    handleClickEvent(x, y) {
        let data = this.state.grid;
        if(data[y][x].isRevealed || data[y][x].isFlagged) {
            return null;
        }

        if(data[y][x].isMine) {
            alert("Game over!");
            this.revealAll(data);
            this.setState({'grid': data});
            return null;
        }

        data[y][x].isRevealed = true;
        let mineCount = this.getValue(x, y, data);
        if(mineCount < 1) {
            data[y][x].value = null;
        } else {
            data[y][x].value = mineCount;
        }

        if(mineCount === 0) {
            this.revealRecursive(x, y, data);
        }
        this.setState({'grid': data});
    }

    checkFlagPositions(data) {
        let success = true;
        data.forEach((row) => {
            row.forEach((el) => {
                if(el.isMine && !el.isFlagged) {
                    success = false;
                    return;
                }
            });
        });
        return success;
    }

    revealAll(data) {
        data.forEach((row) => {
            row.forEach((element) => {
                element.isRevealed = true;
            });
        });
    }

    revealRecursive(x, y, data) {
        // Get neighbours
        let neighbours = this.getNeighbours(x, y, data);
        while(neighbours.length !== 0) {
            neighbours.forEach((neighbour) => {
                // Check if the neighbour is NOT a mine or revealed or flagged.
                if(neighbour.isMine || neighbour.isRevealed || neighbour.isFlagged) {
                    return;
                }

                // Set neighbour to revealed and remove it from the 'neighbours' array.
                neighbour.isRevealed = true;
                neighbours.splice(neighbours.indexOf(neighbour), 1);

                // If the 'neighbour' doesn't have a value of zero. Skip the recursion step.
                if(this.getValue(neighbour.x, neighbour.y, data) !== 0) {
                    return;
                }

                let addedNeighbours = this.getNeighbours(neighbour.x, neighbour.y, data);
                addedNeighbours.forEach((an) => {
                    if(an.isMine || an.isRevealed || an.isFlagged || (neighbours.indexOf(an) !== -1)) {
                        return;
                    }

                    neighbours.push(an);
                });
            });
        }
    }

    getValue(x, y, data) {
        let neighbours = this.getNeighbours(x, y, data);
        let a = this.getMineCount(neighbours);
        return a;
    }

    getNeighbours(x, y, data) {
        let neighbours = [];

        if(x > 0) {
            neighbours.push(data[y][x - 1]);
        }

        if(x < this.props.width - 1) {
            neighbours.push(data[y][x + 1]);
        }

        if(y > 0) {
            neighbours.push(data[y - 1][x]);
        }

        if(y < this.props.height - 1) {
            neighbours.push(data[y + 1][x]);
        }

        if(x > 0 && y > 0) {
            neighbours.push(data[y - 1][x - 1]);
        }

        if(x < this.props.width - 1 && y > 0) {
            neighbours.push(data[y - 1][x + 1]);
        }

        if(x < this.props.width - 1 && y < this.props.height - 1) {
            neighbours.push(data[y + 1][x + 1]);
        }

        if(x > 0 && y < this.props.height - 1) {
            neighbours.push(data[y + 1][x - 1]);
        }
        return neighbours;
    }

    generateSquareData(x, y) {
        return ({
            'x': x,
            'y': y,
            'isMine': false,
            'isRevealed': false,
            'isFlagged': false,
            'value': null
        });
    }

    getMineCount(array) {
        let a = array.reduce((mineCount, squareData) => {
            if(squareData['isMine']) {
                return mineCount + 1;
            } else {
                return mineCount;
            }
        }, 0);

        return a;
    }

    initializeGrid() {
        let grid = [];
        let mineCounter = 0;

        for(let y = 0; y < this.props.height; y++) {
            let row = [];
            for(let x = 0; x < this.props.width; x++) {
                row.push(this.generateSquareData(x, y));
            }
            grid.push(row);
        }

        while(this.getMineCount(grid.flat()) < this.props.mineCount) {
            let randomY = Math.floor(Math.random() * grid.length)
            let randomX = Math.floor(Math.random() * grid[randomY].length);
            grid[randomY][randomX].isMine = true;
        }

        return grid;
    }


    render() {
        let grid = this.state.grid;
        return (
            <div>
            <table>
            <tbody>
                {grid.map((row) => {
                    return (
                        <tr>
                            {row.map((square) => {
                                let val = this.getValue(square.x, square.y, grid);
                                return (<td>
                                            <Square
                                                clickEvent={() => this.handleClickEvent(square.x, square.y)}
                                                value={val}
                                                isMine={square.isMine}
                                                isRevealed={square.isRevealed}
                                                isFlagged={square.isFlagged}
                                                cMenuEvent={(e) => this.handleContextMenu(e, square.x, square.y)}
                                            />
                                        </td>);
                            })}
                        </tr>
                    );
                })}
            </tbody>
            </table>
            <span>Mines: {this.props.mineCount} Flagged: {this.state.flaggedCounter} Success: {this.state.success.toString()}</span>
            </div>
        );
    }
}

let width = parseInt(prompt("Width of board: "));
let height = parseInt(prompt("Height of board: "));
let mineCount = parseInt(prompt("Number of mines: "));

ReactDOM.render(<Grid width={width} height={height} mineCount={mineCount}/>, document.getElementById("gridContainer"));
