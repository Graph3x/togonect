import {React, Component} from 'react';
import {Navigate} from 'react-router-dom';

class LogoutButton extends Component {

  state = {
    redirect: false
  }

  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('togo_id');
    this.setRedirect();

}

  setRedirect = () => {
    this.setState({redirect: true})
  }


  renderRedirect = () => {
    if (this.state.redirect)
    {
      return(<Navigate to='/'/>);
    }
  }



  render() {
    return (
    <div>
        {this.renderRedirect()}
        <button onClick={this.logout} className='clickable'>LOGOUT</button>
    </div>
  );
  }
}

export default LogoutButton;