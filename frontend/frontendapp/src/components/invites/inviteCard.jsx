import {React, Component, Fragment} from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import handleError from '../common/handleError';


class InviteCard extends Component {

  constructor (props){
        super(props);
  }

  state = {
        author: '',
        game: '',
        freeSlots: 0,
        navigator: false,
  }

  componentDidMount() {
        this.getAuthor();
        this.getGame();
        this.getSlots();
        
  }

  getAuthor = () => {
        for(let i in this.props.invite.users) {
            if(this.props.invite.users[i].id == this.props.invite.author_id){
                this.setState({author: this.props.invite.users[i]})
            }
        }
  }

  getGame = () =>{
        fetch('http://localhost:8000/games/' + this.props.invite.game_id)
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

  gameElement = (game) => {
    return(
        <Fragment key={game.id}>
          <NavLink to={'/events/' + this.props.invite.id}>
            <img src={game.cover} className='invite_game'/>
          </NavLink>
        </Fragment>
    )
  }


  join = () => {
    fetch('http://localhost:8000/invites/' + this.props.invite.id + '/join?token=' + localStorage.getItem('token'))
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
    fetch('http://localhost:8000/invites/' + this.props.invite.id + '/cancel?token=' + localStorage.getItem('token'))
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


  getSlots = () => {
    let taken = this.props.invite.users.length;
    let free = this.props.invite.slots - taken;
    this.setState({freeSlots: free});
  }

  getTime = () => {
    if(this.props.invite.time){
        return <h3 className='invite_time'>{this.props.invite.time}</h3>
    }
    return <h3 className='invite_time'>No Time</h3>
  }

  renderButton = () => {
    if(this.state.author.id == this.props.udata.id){
      return <button onClick={this.cancel} className='invite_button btn'>CANCEL</button>
    }


    if(this.state.freeSlots < 1 && this.state.freeSlots > -1) {
      return <p className='invite_button btn'>FULL</p>
    }

    if (this.props.udata.invite == null){
      return <button onClick={this.join} className='invite_button btn'>JOIN</button>
      }
    if (this.props.udata.invite.id == this.props.invite.id){
        return <button onClick={this.leave} className='invite_button btn'>LEAVE</button>
    }
    
  }

  renderSlots = () => {

    if(this.state.freeSlots <= -1){
      return <h3 className='invite_slots'>Unlimited</h3>
    }

    return <h3 className='invite_slots'>{this.state.freeSlots}/{this.props.invite.slots}</h3>
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
    <div className='invite'>
        {this.gameElement(this.state.game)}
        <h3 className='invite_name'>{this.state.author.username}</h3>
        {this.renderSlots()}
        {this.getTime()}
        {this.renderButton()}
        {this.renderNavigator()}
    </div>
  );
  }
}

export default InviteCard;