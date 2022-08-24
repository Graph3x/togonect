import {React, Component} from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Navigate } from 'react-router-dom'


class GoogleButton extends Component {
  state = {redirect: false, togoid: 0}


  responseGoogle = (response) => {
    fetch('http://localhost:8000/auth?token=' + response.credential)
    .then((response) => {return response.json();})
    .then((jsondata) => {localStorage.setItem('token', jsondata); this.setRedirect();})
  }


  setRedirect = () => {
    this.setState({redirect: true})
  }


  renderRedirect = () => {
    if (this.state.redirect)
    {
      const token = localStorage.getItem('token');
      fetch('http://localhost:8000/users/getid?token=' + token)
      .then((response) => {return response.json();})
      .then((jsondata) => {localStorage.setItem('togo_id', jsondata); return jsondata})
      .then((jsondata) => {this.setState({togoid: jsondata})});

      if (this.state.togoid != 0) {
        return(<Navigate to={'/profile/' + this.state.togoid}/>)
      }
    }
  }


  render() {
    return (
      <div>

        {this.renderRedirect()}

        <GoogleOAuthProvider clientId="482211007182-h2fa91plomr40ve2urcc9pne9du53gqo.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={this.responseGoogle}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </GoogleOAuthProvider>
      </div>
  );
  }
}

export default GoogleButton;





