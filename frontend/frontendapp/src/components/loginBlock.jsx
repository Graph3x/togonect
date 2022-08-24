import {React, Component} from 'react';
import GoogleButton from './googleButton';
import TestButton from './testButton';


class LoginBlock extends Component {
  render() {
    return (
        <div id='google_login'>
            <GoogleButton></GoogleButton>
            <br />
            <TestButton></TestButton>
        </div>
  );
  }
}

export default LoginBlock;