import {React, Component} from 'react';
import { Navigate } from 'react-router-dom';
import GoogleButton from './googleButton';
import handleError from '../common/handleError';

class LoginBlock extends Component {

  state = {
    redirect: false,
  }

  renderRedirect = () => {
    if (localStorage.getItem('token') != null)
    {
      fetch('http://localhost:8000/?token=' + localStorage.getItem('token'))
      .then((response) => {return response.json()})
      .then((jsondata) => {
        if(Object.keys(jsondata).includes('detail')){
          console.log('PRECO')
          localStorage.removeItem('togo_id');
          localStorage.removeItem('token');
          window.location.reload();
          
        }
        else{
          this.setState({redirect: true})
        }
      }
      )
    }
    else {
      return <GoogleButton/>
    }

  }


  render() {
    return (
      <div>
        {this.renderRedirect()}
        {this.state.redirect? <Navigate to={'/homepage'}/> : null}
      </div>
  );
  }
}

export default LoginBlock;