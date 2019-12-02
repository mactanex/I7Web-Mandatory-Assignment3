import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import logo from "./logo.svg";
import { Button, Col, Container, Row } from "reactstrap";
import "./App.scss";

import Game from "./Game/Game";

export interface IState {
  gameRunning: boolean;
  gridSize: number;
  score: number;
  ws: WebSocket | null;
}

class App extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      gameRunning: false,
      gridSize: 3,
      score: 0,
      ws: null
    };
  }

  componentDidMount() {
    this.connect();
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
    ws.onmessage = msg => console.log(msg);
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

  public render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
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
                <p>{this.state.score}</p>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
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
  };
}

export default App;
