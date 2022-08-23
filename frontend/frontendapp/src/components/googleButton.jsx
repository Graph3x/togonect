import {React, Component} from 'react';
//import GoogleLogin from 'react-google-login';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';


const responseGoogle = (response) => {
  console.log(response);
}

const temp = () =>{
  fetch('http://localhost:8000',{
    credentials:'include' 
  })
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
    alert(myJson)
  });
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
          />;
        </GoogleOAuthProvider>;
        <br/>
        <br/>
        <br/>
        <button onClick={temp}> Check session </button>
    </div>
  );
  }
}

export default GoogleButton;





