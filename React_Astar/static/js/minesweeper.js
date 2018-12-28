class Square extends React.Component {
    render() {
        let returnElement;
        if(this.props.isRevealed) {
            returnElement = <div className="gridSquare revealedSquare" onClick={this.props.clickEvent}> {this.props.value}</div>;
        } else {
            returnElement = <div className="gridSquare" onClick={this.props.clickEvent}></div>;
        }
        return returnElement;
    }
}

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'grid': this.initializeGrid(),
        };
    }

    handleClickEvent(x, y) {
        let data = this.state.grid;
        if(data[y][x].isRevealed) {
            return null;
        }

        if(data[y][x].isMine) {
            alert("Game over!");
            return null;
        }

        data[y][x].isRevealed = true;
        let mineCount = this.getValue(x, y, data);
        if(mineCount < 1) {
            data[y][x].value = "";
        } else {
            data[y][x].value = mineCount;
        }
        if(mineCount === 0) {
            let neighbours = this.getNeighbours(x, y, data);
            while(neighbours.length !== 0) {
                for(let i = 0; i < neighbours.length; i++) {
                    let current = neighbours[i];
                    neighbours.splice(i, 1);
                    if(current.isMine || current.isRevealed) {
                        continue;
                    }

                    data[current.y][current.x].isRevealed = true;

                    if(this.getValue(current.x, current.y, data) !== 0) {
                        continue;
                    }

                    let recursiveNeighbours = this.getNeighbours(current.x, current.y, data);
                    for(let j = 0; j < recursiveNeighbours.length; j++) {
                        let currentRecursive = recursiveNeighbours[j];
                        if(currentRecursive.isMine || currentRecursive.isRevealed || neighbours.indexOf(currentRecursive) !== -1) {
                            continue;
                        }

                        neighbours.push(currentRecursive);
                    }
                }
            }
        }
        this.setState({'grid': data});
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
                                return (<td><Square clickEvent={() => this.handleClickEvent(square.x, square.y)} value={val} isRevealed={square.isRevealed}/></td>);
                            })}
                        </tr>
                    );
                })}
            </tbody>
            </table>
            <span>Mines: {this.props.mineCount}</span>
            </div>
        );
    }
}

ReactDOM.render(<Grid width={20} height={10} mineCount={20}/>, document.getElementById("gridContainer"));
