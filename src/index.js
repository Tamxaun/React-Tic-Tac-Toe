import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let squares = [];
    for (let row = 0; row < 3; row++) {
      let squaresRow = [];
      for (let col = 0; col < 3; col++) {
        squaresRow.push(
          <span key={row * 3 + col}>{this.renderSquare(row * 3 + col)}</span>
        );
      }
      squares.push(
        <div className="board-row" key={row}>
          {squaresRow}
        </div>
      );
    }
    return <div>{squares}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          col: null,
          row: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // const rowcol = (n) => {
    //   const arr = [
    //     [1, 2, 3],
    //     [4, 5, 6],
    //     [7, 8, 9],
    //   ];
    //   const isRowHasNum = (element) => element.includes(n);
    //   const isColHasNum = (element) => element === n;
    //   const row = arr.findIndex(isRowHasNum) + 1;
    //   const col = arr[row - 1].findIndex(isColHasNum) + 1;
    //   return {
    //     col,
    //     row,
    //   };
    // };
    // const { col, row } = rowcol(i + 1);

    this.setState({
      history: history.concat([
        {
          squares: squares,
          col: Math.floor((i % 3) + 1),
          row: Math.floor(i / 3 + 1),
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const currentMove = this.state.stepNumber;
    const current = history[currentMove];
    const winner = calculateWinner(current.squares);

    const moves = history.map(({ col, row }, move) => {
      const desc = move
        ? `Go to move #${move}, col: ${col}, row: ${row}`
        : 'Go to game start';
      return (
        <li className={currentMove === move ? 'current' : ''} key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner is ${winner}`;
    } else if (history.length === 10) {
      status = 'No one wins';
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    console.log('state:', this.state);

    return (
      <div className="game">
        <div className="game-status">
          <div>{status}</div>
        </div>
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-history">
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Game />);
