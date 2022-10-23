import {React, Component, Fragment} from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DeleteUserButton from './deleteUserButton';
import ResetTokenButton from './resetTokenButton';
import {SelectGameAddPopup} from '../common/popup';
import handleError from '../common/handleError';

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
        navigator: null,
    }

  renderNavigator = () => {
    if(this.state.navigator) {
      if(window.location.href.replace('http://localhost:3000', '') != this.state.navigator)
      {
        return <Navigate to={this.state.navigator}/>
      }
      else{
        window.location.reload();
      }
    }
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
    .then((jsondata) => {
      if(Object.keys(jsondata).includes('detail')){
        let redirectAddress = handleError(jsondata['detail'])
        if(redirectAddress){
          this.setState({navigator: redirectAddress})
        }
      }
      else{
        return(jsondata)
      }
    }
    )
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
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ username: this.state.value })
      }
      let path = 'http://localhost:8000/users/' + this.state.id + '/edit?token=' + localStorage.getItem('token'); 
      fetch(path, requestOptions)
      .then((response) => {return response.json()})
      .then((jsondata) => {
      if(Object.keys(jsondata).includes('detail')){
        let redirectAddress = handleError(jsondata['detail'])
        if(redirectAddress){
          this.setState({navigator: redirectAddress})
        }
      }
      else{
        this.setRedirect();
      }
    }
    )
    }
    
  }

  removeGame = (gid) => {
    let path = 'http://localhost:8000/games/' + gid + '/remove?token=' + localStorage.getItem('token');
    fetch(path)
    .then((response) => {return response.json()})
    .then((jsondata) => {
      if(Object.keys(jsondata).includes('detail')){
        let redirectAddress = handleError(jsondata['detail'])
        if(redirectAddress){
          this.setState({navigator: redirectAddress})
        }
      }
      else{
        window.location.reload();
      }
    }
    )
  }

  gameElement = (game) => {
    return(
        <Fragment key={game.id}>
          <button onClick={() => this.removeGame(game.id)} className='edit_game_btn'>
            <img className='gameX profile_game' src={game.cover}/>
          </button>
        </Fragment>
    )
  }

  togglePopup = () => {
    this.setState({showPopup: !this.state.showPopup});
  }

  renderNickInput = () => {
    let inLen = this.state.value.length
    let validLen = inLen > 1 && inLen < 32
    let validChars = /^[ \w+]*$/.test(this.state.value)

    if((validLen == false && inLen != 0) || !validChars){
      return <p className='nick_text'>{'Nickname has to be 2 to 31 characters long using only number, letters, spaces and _.'}</p>
    }
  
    return <button onClick={this.handleSave} id='save_profile_button'>SAVE</button>
  }

  render() {
    return (
      <Fragment>
        {this.renderNavigator()}
        {this.state.showPopup ? <SelectGameAddPopup closePopup={this.togglePopup.bind(this)}/>: null}
        <div id='edit'>
          {this.renderRedirect()}
          <div className='center_holder'>
            <form>
              <input type="text" value={this.state.value} onChange={this.handleChange} placeholder={this.state.userdata.username} className='edit_nickname'/>
            </form>
            {this.renderNickInput()}
          </div>
          <div id='games_div' className='center_holder'>
            {this.state.games.map(g => this.gameElement(g))}
          </div>
          <div className='center_holder'>
            <button onClick={this.togglePopup} id='add_game_button'>ADD GAME</button>
          </div>
        </div>
        <div id='danger_holder' className='center_holder'>
          <div id='danger_edit' className='center'>
            <ResetTokenButton/>
            <DeleteUserButton/>
          </div>
        </div>
      </Fragment>
  );
  }
}


export default withParams(EditPage);