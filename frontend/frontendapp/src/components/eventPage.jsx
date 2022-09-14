import {React, Component} from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';


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
  }

  componentDidMount(){
    this.getEvent(this.props.params.iden);
    this.getProfile(localStorage.getItem('togo_id'));
  }

  getEvent = (eventId) =>{
  fetch('http://localhost:8000/invites/' + eventId + '?token=' + localStorage.getItem('token'))
  .then((response) => {return response.json();})
  .then((jsondata) => {this.setState({event: jsondata}); return jsondata;})
  .then((jsondata) => {this.getGame(jsondata.game_id)})
}

  getProfile = (iden) => {
    fetch('http://localhost:8000/users/' + iden.toString())
    .then((response) => {return response.json();})
    .then((jsondata) => {this.setState({udata:jsondata})})
  }

  getGame = (gameId) =>{
    fetch('http://localhost:8000/games/' + gameId)
    .then((response) => {return response.json();})
    .then((jsondata) => {this.setState({game: jsondata});})
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
    .then((response) => {window.location.reload();}) 
  }

  leave = () => {
    fetch('http://localhost:8000/invites/0/leave?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
    .then((response) => {window.location.reload();}) 
  }


  cancel = () => {
    fetch('http://localhost:8000/invites/' + this.state.event.id + '/cancel?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
    .then((response) => {window.location.reload();}) 
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

  render() {
    return (
      <div>
        <img src={this.state.game.cover}/>
        <h2>{this.state.event.time}</h2>
        <h1>Attending:</h1>
        {this.rednerUsers()}
        {this.renderButton()}
      </div>
  );
  }
}

export default withParams(EventPage);