import {React, Component} from 'react';
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
import {Navigate} from 'react-router-dom'

import handleError from '../common/handleError';


class GoogleButton extends Component {
  state = {
    redirect: false,
    togoid: 0,
    navigator: false,
  }


  setRedirect = () => {
    this.setState({redirect: true})
  }

  responseGoogle = (response) => {
    fetch('http://localhost:8000/auth/google?token=' + response.credential)
    .then((response) => {return response.json();})
    .then((jsondata) => {
      if(Object.keys(jsondata).includes('detail')){
        let redirectAddress = handleError(jsondata['detail'])
        if(redirectAddress){
          this.setState({navigator: redirectAddress})
        }
      }
      else{
        localStorage.setItem('token', jsondata);
        this.setRedirect();
      }
    }
    )
  }

  renderRedirect = () => {
    if (this.state.redirect)
    {
      const token = localStorage.getItem('token');
      fetch('http://localhost:8000/users/getid?token=' + token)
      .then((response) => {return response.json();})
      .then((jsondata) => {
        if(Object.keys(jsondata).includes('detail')){
          let redirectAddress = handleError(jsondata['detail'])
          if(redirectAddress){
            this.setState({navigator: redirectAddress})
          }
        }
      else{
        localStorage.setItem('togo_id', jsondata);
        this.setState({togoid: jsondata}); 
      }
     }
    )
    }
  if(localStorage.getItem('togo_id')){
    return(<Navigate to={'/profile/' + localStorage.getItem('togo_id') + '/edit'}/>)
  } 
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

  render() {
    return (
      <div>
        {this.renderRedirect()}
        {this.renderNavigator()}
        <GoogleOAuthProvider clientId="482211007182-h2fa91plomr40ve2urcc9pne9du53gqo.apps.googleusercontent.com">
          <GoogleLogin onSuccess={tokenResponse => {this.responseGoogle(tokenResponse)}} theme='filled_blue' shape='pill' size='large'></GoogleLogin>
        </GoogleOAuthProvider>
      </div>
  );
  }
}

export default GoogleButton;