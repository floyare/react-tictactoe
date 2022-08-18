import {useState, useEffect} from 'react';
import toast, {Toaster} from 'react-hot-toast';

function App() {
  const [player1Moves, setPlayer1Moves] = useState([]);
  const [player2Moves, setPlayer2Moves] = useState([]);
  const [movesLeft, setMovesLeft] = useState([0,1,2,3,4,5,6,7,8]);
  const [playerTurn, setPlayerTurn] = useState(1);
  const winning = [[0,1,2], [3,4,5], [6,7,8], [0,4,8], [6,4,2], [0,3,6], [1,4,7], [2,5,8]];
  const [board, setBoard] = useState([
    {"id": 0, "player": ""},
    {"id": 1, "player": ""},
    {"id": 2, "player": ""},
    {"id": 3, "player": ""},
    {"id": 4, "player": ""},
    {"id": 5, "player": ""},
    {"id": 6, "player": ""},
    {"id": 7, "player": ""},
    {"id": 8, "player": ""},
  ])
  const [roundStatus, setRoundStatus] = useState({"winner": "", "end": false});
  const [stats, setStats] = useState({'player1': 0, 'player2': 0, 'bot': 0, 'player0': 0});
  const [vsBot, setVsBot] = useState(false);
  const [botTurn, setBotTurn] = useState(false);

  const updateStats = (newStats) => {
    if(localStorage.getItem("reactTicTacToeStats") === null)
      localStorage.setItem("reactTicTacToeStats", JSON.stringify({'player1': 0, 'player2': 0, 'bot': 0, 'player0': 0}));

    setStats(newStats);
    localStorage.setItem("reactTicTacToeStats", JSON.stringify(newStats));
  }

  const getStats = () => {
    if(localStorage.getItem("reactTicTacToeStats") === null)
      localStorage.setItem("reactTicTacToeStats", JSON.stringify({'player1': 0, 'player2': 0, 'bot': 0, 'player0': 0}));

    return JSON.parse(localStorage.getItem("reactTicTacToeStats"));
  }

  useEffect(() => {
    setStats(getStats());
  }, [])

  useEffect(() => {
    if(vsBot){
      if(playerTurn == 2){
        setBotTurn(true);
      }
    }
  },[roundStatus])

  useEffect(() => {
    if(botTurn){
      setTimeout(() => {
        // Wszystkie dostepne ruchy 
        const possibleMoves = movesLeft;
        if(possibleMoves.length !== 0){
      
          // Ruchy gracza
          const playerMoves = player1Moves;

          // Ostatni ruch gracza wraz z jego indexem.
          const latestPlayerMoveIndex = playerMoves.length - 1;
          const latestPlayerMove = playerMoves[latestPlayerMoveIndex];

          // Sugerowane kombinacje na podstawie ostatniego ruchu gracza.
          const bestMoves = winning.filter((comb) => {
            if(comb[playerMoves.length - 1] === latestPlayerMove){
              return comb[playerMoves.length];
            }
          })

          console.log(bestMoves);

          let calcMove;

          if(bestMoves.length === 0){
            const field = Math.floor(Math.random() * possibleMoves.length);
            calcMove = possibleMoves[field];
          }else{
            const randomComb = bestMoves[Math.floor(Math.random()*bestMoves.length)];
            calcMove = randomComb[latestPlayerMoveIndex + 1];
          }

          console.log("%c Best move: " + calcMove, "color: green");

          document.getElementById(calcMove).click();

          setBotTurn(false);

          //Co potrafi:
          // - przewiduje pierwszy ruch i wybiera losowa kombinacje

          //Co musi umiec:
          // - gdy gracz jest blisko wygranej musi mu przerwac kombinacje.




          //const field = Math.floor(Math.random() * possibleMoves.length);

          // console.log(possibleMoves[field]);
          // if(possibleMoves[field] !== undefined){
          //   document.getElementById(possibleMoves[field]).click();
          //   setBotTurn(false);
          // }else{
          //   setTimeout(() => {
          //     restartGame();
          //   },2000)
          // }

          }
      },100);
    }
  }, [botTurn])

  const restartGame = () =>{
    const fields = document.querySelectorAll(".field");
    fields.forEach((field) => {
      field.style.backgroundImage = "none";
    })

    setBoard([
      {"id": 0, "player": ""},
      {"id": 1, "player": ""},
      {"id": 2, "player": ""},
      {"id": 3, "player": ""},
      {"id": 4, "player": ""},
      {"id": 5, "player": ""},
      {"id": 6, "player": ""},
      {"id": 7, "player": ""},
      {"id": 8, "player": ""},
    ]);

    setPlayerTurn(roundStatus.winner !== "" ? roundStatus.winner === "x" ? 2 : 1 : 1);
    setMovesLeft([0,1,2,3,4,5,6,7,8]);
    setPlayer1Moves([]);
    setPlayer2Moves([]);
    setRoundStatus({"winner": "", "end": false});
    setBotTurn(false);
  }

  const clickHandle = (e) => {
    if(!roundStatus.end){
      if(movesLeft.length !== 0){
        const id = Number.parseInt(e.target.id);

        if(movesLeft.includes(id)){
          const playerMoves = playerTurn === 1 ? player1Moves : player2Moves;
          playerMoves.push(id);
          playerTurn === 1 ? setPlayer1Moves(playerMoves) : setPlayer2Moves(playerMoves);
          e.target.style.backgroundImage = playerTurn === 1 ? "url('./x.png')" : "url('./o.png')";
          
          const tempBoard = board;
          tempBoard[id].player = playerTurn === 1 ? "x" : "o";
          setBoard(tempBoard);
      
          const newMoves = movesLeft.filter(function(e){
              return e != id;
          });
          setMovesLeft(newMoves);
    
          const currentMoves = playerTurn === 1 ? player1Moves : player2Moves;
          if(currentMoves.length >= 3){
            winning.filter((win) => {
              if(win.every(ai => currentMoves.includes(ai))){
                if(!roundStatus.end){
                  const tempRound = roundStatus;
                  tempRound.end = true;
                  tempRound.winner = (playerTurn == 1 ? 'x' : 'o');
                  setRoundStatus(tempRound);
                  vsBot ? playerTurn === 2 ? toast("Bot wins!", {icon: '🤖',}) : toast("Player wins!", {icon: '🎉',}) : toast("Player " + playerTurn + " wins!", {icon: '🎉',});
    
                  const Stats = stats;
                  vsBot ? playerTurn === 1 ? Stats.player0++ : Stats.bot++ : playerTurn === 1 ? Stats.player1++ : Stats.player2++;
                  updateStats(Stats);
    
                  setTimeout(() => {
                    restartGame();
                  },2000)
                }
              }
            })
          }
  
          setPlayerTurn(playerTurn === 1 ? 2 : 1);

          if(vsBot){
            setBotTurn(true);
          }
  
          if(!roundStatus.end){
            if(movesLeft.length === 1){
              toast("Draw!", {
                icon: '😴',
              });

              setTimeout(() => {
                restartGame();
              },2000)
            }
          }
        }
      }
    }
  }

  return (
    <div className="App">
      <div><Toaster/></div>
      <div className="board-wrapper">
        <h1>React TicTacToe</h1>
        <div className="board">
          <ul>
            <li onClick={clickHandle} className="field" id="0" style={{borderTopStyle: 'none', borderRightStyle: 'solid', borderLeftStyle: 'none', borderBottomStyle: 'solid'}}></li>
            <li onClick={clickHandle} className="field" id="1" style={{borderTopStyle: 'none', borderRightStyle: 'none', borderLeftStyle: 'none', borderBottomStyle: 'solid'}}></li>
            <li onClick={clickHandle} className="field" id="2" style={{borderTopStyle: 'none', borderRightStyle: 'none', borderLeftStyle: 'solid', borderBottomStyle: 'solid'}}></li>
          </ul>
          <ul>
            <li onClick={clickHandle} className="field" id="3" style={{borderTopStyle: 'none', borderRightStyle: 'solid', borderLeftStyle: 'none', borderBottomStyle: 'solid'}}></li>
            <li onClick={clickHandle} className="field" id="4" style={{borderTopStyle: 'none', borderRightStyle: 'none', borderLeftStyle: 'none', borderBottomStyle: 'solid'}}></li>
            <li onClick={clickHandle} className="field" id="5" style={{borderTopStyle: 'none', borderRightStyle: 'none', borderLeftStyle: 'solid', borderBottomStyle: 'solid'}}></li>
          </ul>
          <ul>
            <li onClick={clickHandle} className="field" id="6" style={{borderTopStyle: 'none', borderRightStyle: 'solid', borderLeftStyle: 'none', borderBottomStyle: 'none'}}></li>
            <li onClick={clickHandle} className="field" id="7" style={{borderTopStyle: 'none', borderRightStyle: 'solid', borderLeftStyle: 'none', borderBottomStyle: 'none'}}></li>
            <li onClick={clickHandle} className="field" id="8" style={{borderTopStyle: 'none', borderRightStyle: 'none', borderLeftStyle: 'none', borderBottomStyle: 'none'}}></li>
          </ul>
        </div>
        <div className="score">
          {!vsBot && <p>Player1: <span>{stats.player1}</span></p>}
          {!vsBot && <p>Player2: <span>{stats.player2}</span></p>}
          {vsBot && <p>Player: <span>{stats.player0}</span></p>}
          {vsBot && <p>Bot: <span>{stats.bot}</span></p>}
        </div>
        <div className="board settings">
          <div className="switch-button">
            <input className="switch-button-checkbox" type="checkbox" onChange={() => {
              setVsBot((p) => !p);
              restartGame();
            }}></input>
            <label className="switch-button-label" htmlFor=""><span className="switch-button-label-span">Human</span></label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
