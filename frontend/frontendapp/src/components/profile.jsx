import {React, Component} from 'react';
import { useParams } from 'react-router-dom';
import LogoutButton from './logoutButton';

function withParams(Component) {
    return props => <Component {...props} params={useParams()}/>;
}


class Profile extends Component {

    state = {
        userdata : 'None'
    }

  componentDidMount() {
    let { iden } = this.props.params;
    this.getProfile(iden);
  }

  getProfile = (iden) => {
    fetch('http://localhost:8000/users/' + iden.toString())
    .then((response) => {return response.json();})
    .then((jsondata) => {this.setState({userdata:jsondata})})
  }

  render() {
    return (
        <div id='profile'>
            <button>OPTIONS</button>
            <button>EDIT</button>
            <img src={this.state.userdata.profile_picture} alt='Profile picture' height={300} width={300}/>
            <h1>{this.state.userdata.username}</h1>
            <LogoutButton></LogoutButton>
        </div>
  );
  }
}


export default withParams(Profile);