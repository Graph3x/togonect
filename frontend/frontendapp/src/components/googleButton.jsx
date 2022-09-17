import {React, Component} from 'react';
import { GoogleOAuthProvider} from '@react-oauth/google';
import { Navigate } from 'react-router-dom'
import Gbutton from './gbutton';


class GoogleButton extends Component {
  state = {redirect: false, togoid: 0}

  setRedirect = () => {
    this.setState({redirect: true})
  }

  responseGoogle = (response) => {
    fetch('http://localhost:8000/auth/google?token=' + response.credential)
    .then((response) => {return response.json();})
    .then((jsondata) => {localStorage.setItem('token', jsondata); this.setRedirect();})
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
        return(<Navigate to={'/profile/' + this.state.togoid + '/edit'}/>)
      }
    }
  }

  testfunc = (testin) => {console.log(testin)}

  render() {
    return (
      <div>
        {this.renderRedirect()}
        <GoogleOAuthProvider clientId="482211007182-h2fa91plomr40ve2urcc9pne9du53gqo.apps.googleusercontent.com">
          <Gbutton func={this.responseGoogle}/>
        </GoogleOAuthProvider>
      </div>
  );
  }
}

export default GoogleButton;





