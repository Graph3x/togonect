import {React, Component} from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import handleError from '../common/handleError';


class FriendCard extends Component {

    state = {
        userdata: '',
        navigator: false,
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

    componentDidMount() {
        this.getProfile(this.props.iden);
        
    }

    getProfile = () => {
        fetch('http://localhost:8000/users/' + this.props.iden.toString())
        .then((response) => {return response.json();})
        .then((jsondata) => {
            if(Object.keys(jsondata).includes('detail')){
                let redirectAddress = handleError(jsondata['detail'])
                if(redirectAddress){
                this.setState({navigator: redirectAddress})
                }
            }
      else{
        this.setState({userdata:jsondata})
      }
    }
    )
    }


  render() {
    return (
    <div>
        {this.renderNavigator()}
        <NavLink to={'/profile/' + this.props.iden}>
            <img src={this.state.userdata.profile_picture} alt='Profile picture' height={100} width={100} referrerPolicy="no-referrer"/>
        </NavLink>
    </div>
  );
  }
}

export default FriendCard;