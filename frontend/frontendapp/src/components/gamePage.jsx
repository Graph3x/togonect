import {React, Component} from 'react';
import { useParams } from 'react-router-dom';


function withParams(Component) {
    return props => <Component {...props} params={useParams()}/>;
}


class GamePage extends Component {
  state = {
    game: {},
    userGames: [],
  }

  componentDidMount(){
    this.getGame(this.props.params.iden);
    this.getProfile(localStorage.getItem('togo_id'));
  }

  getGame = (gameId) =>{
  fetch('http://localhost:8000/games/' + gameId)
  .then((response) => {return response.json();})
  .then((jsondata) => {this.setState({game: jsondata});})
}

  getProfile = (iden) => {
    fetch('http://localhost:8000/users/' + iden.toString())
    .then((response) => {return response.json();})
    .then((jsondata) => {this.setState({userGames:jsondata.games})})
  }

  removeGame = () => {
    let path = 'http://localhost:8000/games/' + this.state.game.id + '/remove?token=' + localStorage.getItem('token');
    fetch(path)
    .then((response) => {return response.json();})
    .then((jsondata) => {window.location.reload();})
  }

  addGame = () => {
    let path = 'http://localhost:8000/games/' + this.state.game.id + '/add?token=' + localStorage.getItem('token');
    fetch(path)
    .then((response) => {return response.json();})
    .then((jsondata) => {window.location.reload();})
  }

  renderButton = () => {
    for(let i in this.state.userGames) {
      if(this.state.userGames[i].id == this.state.game.id){
        return <button onClick={this.removeGame}>REMOVE</button>
      }
    }
    return <button onClick={this.addGame}>ADD</button>
  }

  render() {
    return (
      <div>
        <img src={this.state.game.cover}/>
        <h1>{this.state.game.name}</h1>
        {this.renderButton()}
      </div>
    
  );
  }
}

export default withParams(GamePage);