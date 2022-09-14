import {React, Component, Fragment} from 'react';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import OptionsMenu from './optionsMenu';
import AddFriendButton from './addFriendButton';
import UnFriendButton from './unFriendButton';


function withParams(Component) {
    return props => <Component {...props} params={useParams()}/>;
}


class Profile extends Component {

    state = {
        userdata : 'None',
        id : 'None',
        render_options: false,
        frqs: [],
        games: [],
    }

  componentDidMount() {
    let { iden } = this.props.params;
    this.setState({'id' : iden})
    this.getProfile(iden);
    this.getFrqs();
  }

  getProfile = (iden) => {
    fetch('http://localhost:8000/users/' + iden.toString())
    .then((response) => {return response.json();})
    .then((jsondata) => {this.setState({userdata:jsondata}); return jsondata})
    .then((jsondata) => {this.setState({games:jsondata.games})})
  }


  getFrqs = () => {
    fetch('http://localhost:8000/frequests?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
    .then((jsondata) => {this.setState({frqs:jsondata})})
  }

  options = () => {
    if(this.state.render_options){this.setState({render_options: false})}
    else {this.setState({render_options: true})}
  }


  unblock = (frq) => {
    fetch('http://localhost:8000/frequests/' + frq.id + '/cancel?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
    .then((r) => {window.location.reload();})
  }


  renderButton = () => {
    if(this.state.id == localStorage.getItem('togo_id')) {
      let path = '/profile/' + localStorage.getItem('togo_id') + '/edit'
      return <NavLink to={path} id='edit_button'>EDIT</NavLink>
    }
    for(let i in this.state.frqs) {
      let frq = this.state.frqs[i]

      if(frq.status == 'accepted'){
        return <UnFriendButton friend_id={this.state.id} id='edit_button'/>
      }
      if(frq.status == 'pending'){
        if(frq.sender == this.state.userdata.id){
          return <NavLink to={'/friends'} id='edit_button'>Accept/Reject</NavLink>
        }
        return <NavLink to={'/friends'} id='edit_button'>Invited</NavLink>
      }
      if(frq.status == 'rejected'){
        if(frq.sender == this.state.userdata.id){
          return <button onClick={() => {this.unblock(frq)}} id='edit_button'>Unblock</button>
        }

        return <p id='edit_button'>Blocking You</p>
      }
    }
    return <AddFriendButton friend_id={this.state.id} id='edit_button'/>

  }


  renderOptions = () => {
    if (this.state.render_options)
    {
      return <OptionsMenu/>
    }
  }


  gameElement = (game) => {
    return(
        <Fragment key={game.id}>
          <NavLink to={'/games/' + game.id}>
            <img src={game.cover} className='profile_game'/>
          </NavLink>
        </Fragment>
    )
  }


  render() {
    return (
        <div id='profile' className='root_div'>
            <button onClick={this.options} className='general_button'>OPTIONS</button>
            {this.renderOptions()}
            {this.renderButton()}
            <br/>
            <div className='center_holder'>
              <img src={this.state.userdata.profile_picture} referrerPolicy="no-referrer" alt='Profile picture' className=  'profile_pfp'/>
            </div>
            <div className='center_holder'>
              <h1 id='nickname'>{this.state.userdata.username}</h1>
            </div>
            
            <div id='games_div' className='center_holder'>
              {this.state.games.map(g => this.gameElement(g))}
            </div>
        </div>
  );
  }
}


export default withParams(Profile);