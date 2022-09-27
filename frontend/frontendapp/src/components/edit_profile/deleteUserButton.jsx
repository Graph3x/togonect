import {React, Component} from 'react';
import {Navigate} from 'react-router-dom';
import ConfirmPopup from '../common/popup';

class DeleteUserButton extends Component {
    constructor(props){  
      super(props);  
      this.state = { showPopup: false };  
    }

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


  togglePopup() {  
    this.setState({showPopup: !this.state.showPopup});  
  }


  confirm = () => {
    this.setState({showPopup: !this.state.showPopup});
    this.deleteUser();
  }


  render() {
    return (
    <div>
        {this.renderRedirect()}
        <button onClick={this.togglePopup.bind(this)} className='danger_button'>DELETE ACCOUNT</button>
        {this.state.showPopup ? <ConfirmPopup text='WARNING: YOU ARE ABOUT TO DELETE YOUR ACCOUNT, ARE YOU SURE?'
        cancelPopup={this.togglePopup.bind(this)} confirmPopup={this.confirm}/> : null}
    </div>
  );
  }
}

export default DeleteUserButton;