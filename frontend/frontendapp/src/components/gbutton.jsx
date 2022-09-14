import {React, Component} from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Navigate } from 'react-router-dom'


function Gbutton(props) {

  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      props.func(tokenResponse)
    },
    flow: 'auth-code',
  });

  return (
    <div className='google_login'>
      <GoogleLogin onSuccess={tokenResponse => {props.func(tokenResponse)}} theme='filled_blue' shape='pill'></GoogleLogin>
    </div>
  );
}


export default Gbutton;