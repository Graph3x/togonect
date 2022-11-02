import {React, Component} from 'react';
import { NavLink } from 'react-router-dom';

import OptionsMenu from './optionsMenu';

import nav_menu from '../../imgs/nav_menu.png'
import nav_friends from '../../imgs/nav_friends.png'
import nav_home from '../../imgs/nav_home.png'
import nav_profile from '../../imgs/nav_profile.png'

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

            <button className='nav-element'>
              <img src={nav_menu} className='nav-pic'/>
            </button>

            <NavLink to={this.state.friendsPath} className='nav-element'>
              <img src={nav_friends} className='nav-pic'/>
            </NavLink>

            <NavLink to={this.state.homePath} className='nav-element'>
              <img src={nav_home} className='nav-pic'/>
            </NavLink>

            <NavLink to={this.state.profilePath} reloadDocument={true} className='nav-element'>
              <img src={nav_profile} className='nav-pic'/>
            </NavLink>

        </div>
  );
  }
}

export default Navbar;