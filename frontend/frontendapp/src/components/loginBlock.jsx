import {React, Component} from 'react';
import { Navigate } from 'react-router-dom';
import GoogleButton from './googleButton';


class LoginBlock extends Component {

  state = {
    redirect: false
  }


  renderRedirect = () => {
    if (localStorage.getItem('token'))
    {
      return(<Navigate to='/homepage'/>);
    }
  }


  render() {
    return (
        <div>
            {this.renderRedirect()}
            <GoogleButton/>
        </div>
  );
  }
}

export default LoginBlock;