import {React, Component} from 'react';
import {Navigate} from 'react-router-dom';

class DeleteUserButton extends Component {

  state = {
    redirect: false
  }

  deleteUser = () => {
    let token = localStorage.getItem('token');
    let togo_id = localStorage.getItem('togo_id');
    fetch('http://localhost:8000/users/' + togo_id + '?token=' + token, {method: 'DELETE'});
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
        <button onClick={this.deleteUser}>DELETE ACCOUNT</button>
    </div>
  );
  }
}

export default DeleteUserButton;