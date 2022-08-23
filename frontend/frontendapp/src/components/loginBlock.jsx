import {React, Component} from 'react';
import GoogleButton from './googleButton';
import LogoutButton from './logoutButton';
import TestButton from './testButton';


class LoginBlock extends Component {
  render() {
    return (
        <div id='google_login'>
            <GoogleButton></GoogleButton>
            <br />
            <LogoutButton></LogoutButton>
            <br />
            <TestButton></TestButton>
        </div>
  );
  }
}

export default LoginBlock;