import {React, Component} from 'react';
import { NavLink } from 'react-router-dom';


class FriendCard extends Component {

    state = {
        userdata: ''
    }

    componentDidMount() {
        this.getProfile(this.props.iden);
        
    }

    getProfile = () => {
        fetch('http://localhost:8000/users/' + this.props.iden.toString())
        .then((response) => {return response.json();})
        .then((jsondata) => {this.setState({userdata:jsondata})})
    }


  render() {
    return (
    <div>
        <NavLink to={'/profile/' + this.props.iden}>
            <img src={this.state.userdata.profile_picture} alt='Profile picture' height={100} width={100} referrerPolicy="no-referrer"/>
        </NavLink>
    </div>
  );
  }
}

export default FriendCard;