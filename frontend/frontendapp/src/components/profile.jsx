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


  renderButton = () => {
    if(this.state.id == localStorage.getItem('togo_id')) {
      let path = '/profile/' + localStorage.getItem('togo_id') + '/edit'
      return <NavLink to={path}>EDIT</NavLink>
    }
    for(let i in this.state.frqs) {
      let frq = this.state.frqs[i]

      if(frq.status == 'accepted'){
        return <UnFriendButton friend_id={this.state.id}/>
      }
      if(frq.status == 'pending'){
        return <NavLink to={'/friends'}>Invited</NavLink>
      }
      if(frq.status == 'rejected'){
        return <NavLink to={'/friends'}>Blocked</NavLink>
      }
    }
    return <AddFriendButton friend_id={this.state.id}/>

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
            <img src={game.cover}/>
          </NavLink>
        </Fragment>
    )
  }


  render() {
    return (
        <div id='profile'>
            <button onClick={this.options}>OPTIONS</button>
            {this.renderOptions()}
            {this.renderButton()}
            <br/>
            <img src={this.state.userdata.profile_picture} referrerPolicy="no-referrer" alt='Profile picture' height={300} width={300}/>
            <h1>{this.state.userdata.username}</h1>
            {this.state.games.map(g => this.gameElement(g))}
        </div>
  );
  }
}


export default withParams(Profile);