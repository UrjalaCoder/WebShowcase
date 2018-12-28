class Square extends React.Component {
    render() {
        //console.log("Square render: " + this.props.value);
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

    // TODO: Handle click events
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
        //console.log("mineCount: " + mineCount);

        // Recursive neighbour reveal -->
        let neighbours = this.getNeighbours(x, y, data);
        while(neighbours.length >= 1) {
            for(let i = 0; i < neighbours.length; i++) {
                let n = neighbours[i];
                if(n.isMine || n.isRevealed || this.getValue(n.x, n.y, data) !== 0) {
                    neighbours.splice(i, 1);
                    continue;
                }

                // Remove n from neighbours
                neighbours.splice(i, 1);
                data[n.y][n.x].isRevealed = true;

                // Recursive
                let secondOrderNeighbours = this.getNeighbours(n.x, n.y, data);
                for(let j = 0; j < secondOrderNeighbours.length; j++) {
                    let sc = secondOrderNeighbours[j];
                    if(!sc.isRevealed) {
                        if(neighbours.indexOf(sc) === -1) {
                            if(!sc.isMine && this.getValue(sc.x, sc.y, data) === 0)
                                neighbours.push(sc);
                        }
                    }
                }
            }
        }
        console.log(neighbours);
        console.log("DONE!");
        this.setState({'grid': data});
    }

    getValue(x, y, data) {
        let neighbours = this.getNeighbours(x, y, data);
        let a = this.getMineCount(neighbours);
        ////console.log("A: " + a.toString());
        return a;
    }

    getNeighbours(x, y, data) {
        let neighbours = [];

        // Left column
        if(x > 0) {
            neighbours.push(data[y][x - 1]);
        }

        // Right column
        if(x < this.props.width - 1) {
            neighbours.push(data[y][x + 1]);
        }

        // Top row
        if(y > 0) {
            neighbours.push(data[y - 1][x]);
        }

        // Bottom row
        if(y < this.props.height - 1) {
            neighbours.push(data[y + 1][x]);
        }

        // Top left
        if(x > 0 && y > 0) {
            neighbours.push(data[y - 1][x - 1]);
        }

        // Top right
        if(x < this.props.width - 1 && y > 0) {
            neighbours.push(data[y - 1][x + 1]);
        }

        // Bottom right
        if(x < this.props.width - 1 && y < this.props.height - 1) {
            neighbours.push(data[y + 1][x + 1]);
        }

        // Bottom left
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
        ////console.log(array);
        let a = array.reduce((mineCount, squareData) => {
            if(squareData['isMine']) {
                return mineCount + 1;
            } else {
                return mineCount;
            }
        }, 0);

        ////console.log(a);
        return a;
    }

    initializeGrid() {
        let grid = [];
        let mineCounter = 0;

        // Generate initial grid
        for(let y = 0; y < this.props.height; y++) {
            let row = [];
            for(let x = 0; x < this.props.width; x++) {
                row.push(this.generateSquareData(x, y));
            }
            grid.push(row);
        }

        // Add random distribution of mines.
        while(this.getMineCount(grid.flat()) < this.props.mineCount) {
            let randomY = Math.floor(Math.random() * grid.length)
            let randomX = Math.floor(Math.random() * grid[randomY].length);
            grid[randomY][randomX].isMine = true;
        }

        return grid;
    }


    render() {
        let grid = this.state.grid;
        ////console.log(grid);
        return (
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
        );
    }
}

ReactDOM.render(<Grid width={12} height={12} mineCount={10}/>, document.getElementById("gridContainer"));
