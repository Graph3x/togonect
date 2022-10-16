import {React, Component} from 'react';
import { useParams } from 'react-router-dom';
import { NavLink, Navigate } from 'react-router-dom';
import handleError from '../common/handleError';


function withParams(Component) {
    return props => <Component {...props} params={useParams()}/>;
}


class EventPage extends Component {
  state = {
    event: {},
    udata: {},
    game: {},
    author: '',
    freeSlots: -1,
    navigator: false,
  }

  componentDidMount(){
    this.getEvent(this.props.params.iden);
    this.getProfile(localStorage.getItem('togo_id'));
  }

  getEvent = (eventId) =>{
  fetch('http://localhost:8000/invites/' + eventId + '?token=' + localStorage.getItem('token'))
  .then((response) => {return response.json();})
  .then((jsondata) => {
      if(Object.keys(jsondata).includes('detail')){
        let redirectAddress = handleError(jsondata['detail'])
        if(redirectAddress){
          this.setState({navigator: redirectAddress})
        }
      }
      else{
        this.setState({event: jsondata})
        this.getGame(jsondata.game_id)
      }
    }
    )
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
        this.setState({udata:jsondata});
      }
    }
    )
  }

  getGame = (gameId) =>{
    fetch('http://localhost:8000/games/' + gameId)
    .then((response) => {return response.json();})
    .then((jsondata) => {
      if(Object.keys(jsondata).includes('detail')){
        let redirectAddress = handleError(jsondata['detail'])
        if(redirectAddress){
          this.setState({navigator: redirectAddress})
        }
      }
      else{
        this.setState({game: jsondata});
      }
    }
    )
}

  userPic = (userdata) => {
    return (
        <NavLink to={'/profile/' + userdata.id} key={userdata.id}>
            <img src={userdata.profile_picture} alt='Profile picture' height={100} width={100} referrerPolicy="no-referrer"/>
        </NavLink>
    )
  }

  rednerUsers = () => {
    if(this.state.event.users){
        return(this.state.event.users.map(u => this.userPic(u)))
    }
  }


  join = () => {
    fetch('http://localhost:8000/invites/' + this.state.event.id + '/join?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
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

  leave = () => {
    fetch('http://localhost:8000/invites/0/leave?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
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


  cancel = () => {
    fetch('http://localhost:8000/invites/' + this.state.event.id + '/cancel?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
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


  renderButton = () => {
    if(this.state.author.id == localStorage.getItem('togo_id')){
      return <button onClick={this.cancel} className='invite_button btn'>CANCEL</button>
    }

    if(this.state.freeSlots < 1 && this.state.freeSlots > -1) {
      return <p className='invite_button btn'>FULL</p>
    }

    if (this.state.udata.invite == null){
      return <button onClick={this.join} className='invite_button btn'>JOIN</button>
      }
    if (this.state.udata.invite.id == this.state.event.id){
      return <button onClick={this.leave} className='invite_button btn'>LEAVE</button>
    }
    
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

  render() {
    return (
      <div>
        <img src={this.state.game.cover}/>
        <h2>{this.state.event.time}</h2>
        <h1>Attending:</h1>
        {this.rednerUsers()}
        {this.renderButton()}
        {this.renderNavigator()}
      </div>
  );
  }
}

export default withParams(EventPage);