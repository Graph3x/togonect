import {React, Component, Fragment} from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DeleteUserButton from './deleteUserButton';
import ResetTokenButton from './resetTokenButton';
import '../styles.css'
import {SelectGameAddPopup} from './popup';


function withParams(Component) {
    return props => <Component {...props} params={useParams()}/>;
}


class EditPage extends Component {

    state = {
        userdata : 'None',
        id : 'None',
        value : '',
        redirect: false,
        games: [],
        showPopup: false,
    }

  componentDidMount() {
    let { iden } = this.props.params;
    this.setState({id : iden});
    this.getProfile(iden);
    this.handleChange = this.handleChange.bind(this)
  }

  getProfile = (iden) => {
    fetch('http://localhost:8000/users/' + iden.toString())
    .then((response) => {return response.json();})
    .then((jsondata) => {this.setState({userdata:jsondata}); return jsondata})
    .then((jsondata) => {this.setState({games:jsondata.games})})
  }

  handleChange(event) {this.setState({value: event.target.value});}


  setRedirect = () => {
    this.setState({redirect: true})
  }


  renderRedirect = () => {
    if (this.state.redirect)
    {
      let path = '/profile/' + this.state.id;
      return(<Navigate to={path}/>);
    }
  }

  handleSave = () => {
    if(this.state.value) {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.state.value })
      }
      let path = 'http://localhost:8000/users/' + this.state.id + '/edit?token=' + localStorage.getItem('token'); 
      fetch(path, requestOptions)
    }
    this.setRedirect();
  }

  removeGame = (gid) => {
    let path = 'http://localhost:8000/games/' + gid + '/remove?token=' + localStorage.getItem('token');
    fetch(path)
    .then((response) => {return response.json();})
    .then((jsondata) => {window.location.reload();})
  }

  gameElement = (game) => {
    return(
        <Fragment key={game.id}>
          <button onClick={() => this.removeGame(game.id)}>
            <img className='gameX' src={game.cover}/>
          </button>
        </Fragment>
    )
  }

  togglePopup = () => {
    this.setState({showPopup: !this.state.showPopup});
  }

  render() {
    return (
      <Fragment>
        <div id='edit'>
          {this.renderRedirect()}
          <form>        
            <input type="text" value={this.state.value} onChange={this.handleChange} placeholder={this.state.userdata.username}/>
          </form>
          <button onClick={this.handleSave}>SAVE</button>
          <div>
            {this.state.games.map(g => this.gameElement(g))}
            <button onClick={this.togglePopup}>ADD GAME</button>
            {this.state.showPopup ? <SelectGameAddPopup closePopup={this.togglePopup.bind(this)}/>: null}
          </div>
        </div>
        <div id='danger_edit'>
          <br/>
          <ResetTokenButton/>
          <DeleteUserButton/>

        </div>
      </Fragment>
  );
  }
}


export default withParams(EditPage);