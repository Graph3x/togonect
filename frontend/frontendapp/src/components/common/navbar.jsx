import {React, Component} from 'react';
import { NavLink } from 'react-router-dom';


class Navbar extends Component {

    state = {
       friendsPath: '/friends',
       homePath: '/homepage',
       profilePath: '/', 
       searchPath: '/search',
    }

    componentDidMount() {
        const newPath = '/profile/' + localStorage.getItem('togo_id');
        this.setState({profilePath: newPath});
    }

  render() {
    return (
        <div id='navbar'>
            <NavLink to={this.state.friendsPath} className='navelement'>
              <h2 className='navelement'>FRIENDS</h2>
            </NavLink>

            <NavLink to={this.state.homePath} className='navelement'>
              <h2 className='navelement'>HOME</h2>
            </NavLink>

            <NavLink to={this.state.searchPath} className='navelement'>
              <h2 className='navelement'>SEARCH</h2>
            </NavLink>

            <NavLink to={this.state.profilePath} reloadDocument={true} className='navelement'>
              <h2 className='navelement'>PROFILE</h2>
            </NavLink>

        </div>
  );
  }
}

export default Navbar;