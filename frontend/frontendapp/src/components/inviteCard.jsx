import {React, Component, Fragment} from 'react';
import { NavLink } from 'react-router-dom';


class InviteCard extends Component {

  constructor (props){
        super(props);
  }

  state = {
        author: '',
        game: '',
        freeSlots: 0,
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
        .then((jsondata) => {this.setState({game: jsondata});})
  }

  gameElement = (game) => {
    return(
        <Fragment key={game.id}>
          <NavLink to={'/games/' + game.id}>
            <img src={game.cover}/>
          </NavLink>
        </Fragment>
    )
  }


  join = () => {
    fetch('http://localhost:8000/invites/' + this.props.invite.id + '/join?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
    .then((response) => {window.location.reload();}) 
  }

  leave = () => {
    fetch('http://localhost:8000/invites/0/leave?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
    .then((response) => {window.location.reload();}) 
  }


  cancel = () => {
    fetch('http://localhost:8000/invites/' + this.props.invite.id + '/cancel?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
    .then((response) => {window.location.reload();}) 
  }


  getSlots = () => {
    let taken = this.props.invite.users.length;
    let free = this.props.invite.slots - taken;
    this.setState({freeSlots: free});
  }

  getTime = () => {
    if(this.props.invite.time){
        return <h3>{this.props.invite.time}</h3>
    }
    return <h3>No Time</h3>
  }

  renderButton = () => {
    if(this.state.author.id == this.props.udata.id){
      return <button onClick={this.cancel}>CANCEL</button>
    }


    if(this.state.freeSlots < 1 && this.state.freeSlots > -1) {
      return <p>FULL</p>
    }

    if (this.props.udata.invite == null){
      return <button onClick={this.join}>JOIN</button>
      }
    if (this.props.udata.invite.id == this.props.invite.id){
        return <button onClick={this.leave}>LEAVE</button>
    }
    
  }

  renderSlots = () => {

    if(this.state.freeSlots <= -1){
      return <h3>Unlimited Slots</h3>
    }

    return <h3>{this.state.freeSlots}/{this.props.invite.slots}</h3>
  }


  render() {
    return (
    <div>
        {this.gameElement(this.state.game)}
        <h3>{this.state.author.username}</h3>
        {this.renderSlots()}
        {this.getTime()}
        {this.renderButton()}
    </div>
  );
  }
}

export default InviteCard;