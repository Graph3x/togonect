import {React, Component} from 'react';
import { Navigate } from 'react-router-dom';
import GoogleButton from './googleButton';
import TestButton from './testButton';


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
        <div id='google_login'>
            {this.renderRedirect()}
            <GoogleButton></GoogleButton>
            <br />
            <TestButton></TestButton>
        </div>
  );
  }
}

export default LoginBlock;