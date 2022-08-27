import {React, Component} from 'react';
import { Link } from 'react-router-dom';


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
            <Link to={this.state.friendsPath}>FRIENDS</Link>
            <Link to={this.state.homePath}>HOMEPAGE</Link>
            <Link to={this.state.profilePath}>PROFILE</Link>
        </div>
  );
  }
}

export default Navbar;