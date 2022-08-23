import {React, Component} from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';


const responseGoogle = (response) => {
  fetch('http://localhost:8000/auth?token=' + response.credential)
  .then((response) => {return response.json();})
  .then((jsondata) => {localStorage.setItem('token', jsondata);})

}

const temp = () =>{
  fetch('http://localhost:8000/?token=' + localStorage.getItem('token'))
  .then((response) => {return response.json();})
  .then((jsondata) => {alert(jsondata);})
}

class GoogleButton extends Component {
  render() {
    return (
      <div className="GoogleLogin">
        <GoogleOAuthProvider clientId="482211007182-h2fa91plomr40ve2urcc9pne9du53gqo.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </GoogleOAuthProvider>
        
        <br />
        <br />
        <button onClick={temp}>TEST</button>
    </div>
  );
  }
}

export default GoogleButton;





