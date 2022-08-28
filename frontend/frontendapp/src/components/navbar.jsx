import {React, Component} from 'react';
import { NavLink } from 'react-router-dom';


class Navbar extends Component {

    state = {
       friendsPath: '/friends',
       homePath: '/homepage',
       profilePath: '/', 
    }

    componentDidMount() {
        const newPath = '/profile/' + localStorage.getItem('togo_id');
        this.setState({profilePath: newPath});
    }

  render() {
    return (
        <div id='navbar'>
            <NavLink to={this.state.friendsPath} >FRIENDS</NavLink>
            <NavLink to={this.state.homePath}>HOMEPAGE</NavLink>
            <NavLink to={this.state.profilePath} reloadDocument={true}>PROFILE</NavLink>
        </div>
  );
  }
}

export default Navbar;