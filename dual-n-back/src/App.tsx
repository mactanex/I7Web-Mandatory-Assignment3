import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Button, Col, Container, Row } from "reactstrap";
import "./App.scss";

import Game from "./Game/Game";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { LoginForm } from "./login";
import { OpretForm } from "./opret";
import { ApiService } from "./services/ApiService";
const myApiService = new ApiService();
export interface IState {
  gameRunning: boolean;
  gridSize: number;
  score: number;
  ws: WebSocket | null;
  lives: number;
  authenticated: boolean;
  highscores: number[];
}

class App extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      gameRunning: false,
      gridSize: 3,
      score: 0,
      ws: null,
      lives: 3,
      authenticated: false,
      highscores: [0, 0, 0, 0, 0]
    };
  }

  componentDidMount() {
    this.connect();
    const token = myApiService.getAccessTokenFromLocalStorage()
    if (token) {
      this.setState({ authenticated: true });
    }
  }

  connect = () => {
    var ws = new WebSocket("ws://localhost:3333");
    let that: any = this; // cache the this
    var connectInterval: NodeJS.Timeout;

    // websocket onopen event listener
    ws.onopen = () => {
      console.log("connected websocket main component");

      this.setState({ ws: ws });

      that.timeout = 250; // reset timer to 250 on open of websocket connection
      clearTimeout(connectInterval); // clear Interval on on open of websocket connection
    };

    // websocket onclose event listener
    ws.onclose = e => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e.reason
      );

      that.timeout = that.timeout + that.timeout; //increment retry interval
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
    };
    ws.onmessage = msg => this.setState({ highscores: JSON.parse(msg.data) });
    // websocket onerror event listener
    ws.onerror = (err: any) => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );

      ws.close();
    };
  };

  /**
   * utilited by the @function connect to check if the connection is close, if so attempts to reconnect
   */
  check = () => {
    const { ws } = this.state;
    if (!ws || ws.readyState === WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
  };

  logout = () => {
    localStorage.clear();
    window.location.reload();
  }

  public render() {
    return (
      <Router>
        <div className='App'>
          <header className='App-header'>
            <nav>
              <ul>
                {(!this.state.authenticated && (
                  <div>
                    <li><a color='secondary' href="/login">Login</a>{" "}</li>
                    <li><a color='secondary' href="/opret">Signup</a></li>
                  </div>
                )) || <li><a color='secondary' onClick={this.logout}>Logout</a></li>}
                <li><a color='secondary' href="/">Game</a></li>
              </ul>
            </nav>
          </header>
          {(this.state.authenticated && (
            <Container>
              <Row>
                <Col xs='3'>
                  <input
                    type='range'
                    min='3'
                    max='5'
                    className='slider'
                    value={this.state.gridSize}
                    onInput={this.setGridSize}
                    onChange={this.setGridSize}
                  />
                </Col>
                <Col xs='6'>
                  <Game
                    rows={this.state.gridSize}
                    columns={this.state.gridSize}
                    running={this.state.gameRunning}
                    onScoreChange={this.onScoreChange}
                  />
                </Col>

                <Col xs='3'>
                  <Row>
                    <Col xs='12'>
                      <Button
                        color='primary'
                        className={this.state.gameRunning ? "hidden" : ""}
                        onClick={this.onPlay}
                      >
                        Play
                      </Button>
                      <Button
                        color='primary'
                        className={!this.state.gameRunning ? "hidden" : ""}
                        onClick={this.onPause}
                      >
                        Pause
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <p>Score: {this.state.score}</p> <br></br>
                    <p>Lives: {this.state.lives}</p>
                  </Row>
                  <br></br>
                  <Row>
                    <p>First: {this.state.highscores[0]}</p>
                  </Row>
                  <Row>
                    <p>Second: {this.state.highscores[1]}</p>
                  </Row>
                  <Row>
                    <p>Third: {this.state.highscores[2]}</p>
                  </Row>
                  <Row>
                    <p>Fourth: {this.state.highscores[3]}</p>
                  </Row>
                  <Row>
                    <p>Fifth: {this.state.highscores[4]}</p>
                  </Row>
                </Col>
              </Row>
            </Container>
          )) || <p>Du er ikke logget ind</p>}
          <Switch>
            <Route path='/login'>
              <LoginForm></LoginForm>
            </Route>
            <Route path='/opret'>
              <OpretForm></OpretForm>
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }

  private setGridSize = (e: any) => {
    this.setState({ gridSize: e.target.value });
  };

  private onPlay = (e: any) => {
    this.setState({ gameRunning: true });
  };

  private onPause = (e: any) => {
    this.setState({ gameRunning: false });
  };

  private onScoreChange = (prevScore: number, nextScore: number) => {
    this.setState({ score: nextScore });
    if (nextScore - prevScore === -50) {
      if (this.state.lives !== 1) {
        this.setState({ lives: this.state.lives - 1 });
      } else {
        //call update api
        myApiService.updateHighscore(nextScore);
        this.setState({ gameRunning: false, lives: 3, score: 0 });
        nextScore = 0;
      }
    }
  };
}

export default App;
