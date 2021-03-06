//
//
//  // Reference the IRPage-test for comments, this website will only be missing the asnwer.
//
//


import React from 'react';
import axios from 'axios';

class IRPage extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      current: 'james',
      level: '0',
      answer: '0',
      wrong: true,
      combo: 0,
      command: '',
      players: [{
        _id: '1',
        name: 'player',
        level: '1'
      }],
      names: [
        'james', 'eamon', 'june', 'mitch'
      ]
    }
    // https://stackoverflow.com/questions/9418697/how-to-unsubscribe-from-a-socket-io-subscription
    this.socket = io();
    this.socket.removeAllListeners('fanSubscriber');

    this.socket.on('answer', (data) => {
      console.log(data);
        this.setState({
          answer: data,
        })
    });
    this.socket.emit('answerSubscriber');

    this.socket.on('correct', (data) => {
      console.log(data);
        this.setState({
          level: data,
          wrong: false
        })
    });
    this.socket.emit('correctSubscriber');

    this.socket.on('wrong', (data) => {
      console.log(data);
        this.setState({
          level: data,
          wrong: true
        })
    });
    this.socket.emit('wrongSubcriber');

    this.socket.on('combo', (data) => {
      console.log(data);
        this.setState({
          combo: data
        })
    });
    this.socket.emit('comboSubcriber');

    axios.get('/player')
    .then((response) => {
       console.log('response ', response.data);
          this.setState(({
            players: response.data
          }));
    })
    .catch((e) => {
      console.log('Something went wrong fetching /player: ', e);
    });
  }

  onClick = (e) => {
    // this.socket.emit('on', {my: 'data'});
    // console.log('html toggle firing');
    axios.post('/player',{
      name: this.state.current,
      level: this.state.level
    })

  }

  onDropDownChange = (e) => {
    if (e.target.value !== '') {
      this.setState({
        current: e.target.value
      })
    }
  }

  onCommandText = (e) => {
    const command = e.target.value;
    this.setState(() => ({
        command
      }));
  }

  onCommand = (e) => {
    e.preventDefault();
    this.socket.emit('command', {command: this.state.command});
  }

  renderMe = () => {
    if (this.state.wrong) {
        return (
          <td>no</td>
        )
      }
    return  <td>yes</td>;

  }

  render() {
    return (
      <div>
        <div className="content-container">
        <div className="page-header">
            <h1 className="page-header__title">IR Remote Control</h1>
            <button onClick={() => {
              this.props.history.push('/SFpage')
            }}>Move to Smart Fan Page </button>

            <button onClick={() => {
              this.props.history.push('/')
            }}>Move to TEST IR Fan Page </button>
          </div>

        </div>
        <div className="content-container">

        <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Current Player: </td>
            <td>{this.state.current}</td>
          </tr>
          <tr>
            <td>Game Level:  </td>
            <td> {this.state.level} </td>
          </tr>
          <tr>
            <td>Correct Answer:</td>
            <td>{this.state.answer} </td>
          </tr>
          <tr>
            <td>Was the user correct? :</td>
            {
              this.state.combo > 0 ?
                this.renderMe()  : ' Starting... '
            }
          </tr>
          <tr>
            <td>Current Combo:</td>
            <td>{this.state.combo} </td>
          </tr>
        </tbody>
      </table>

        <button onClick={this.onClick}>Save Game Progress</button>
        <input type="text" onChange={this.onCommandText} value={this.state.command} id=""/>
        <button className="button" onClick={this.onCommand} > Cmd </button>

        </div>

        <div className="content-container">
          <h3>Select player</h3>
          <select id="selectPlayer" onChange={this.onDropDownChange}>
            {
              this.state.names.map((name) => (
                <option
                  key={name}
                  name={name}
                  id={name}
                  value={name}
                >
                {name}
                </option>
                ))
            }
          </select>

          <div>
            <h3 className="database-title">Previously Played</h3>
            {
              this.state.players.map((player, index) => (
                  <div className="list-item" key={index}>
                    <p>player: {player.name}</p>
                    <p>level reached: {player.level}</p>
                  </div>
                ))
            }
            </div>
        </div>

      </div>
    )
  }
}

export default IRPage;