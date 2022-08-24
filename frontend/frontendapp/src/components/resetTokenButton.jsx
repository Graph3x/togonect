import {React, Component} from 'react';
import {Navigate} from 'react-router-dom';

class ResetTokenButton extends Component {

  state = {
    redirect: false
  }

  resetToken = () => {
    let token = localStorage.getItem('token');
    let togo_id = localStorage.getItem('togo_id');
    let new_token = fetch('http://localhost:8000/users/' + togo_id + '/deletetoken?token=' + token);
    localStorage.removeItem('token');
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
        <button onClick={this.resetToken}>RESET TOKEN</button>
    </div>
  );
  }
}

export default ResetTokenButton;