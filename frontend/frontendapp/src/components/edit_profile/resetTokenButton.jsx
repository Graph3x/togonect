import {React, Component} from 'react';
import {Navigate} from 'react-router-dom';
import ConfirmPopup from '../common/popup';
import handleError from '../common/handleError';


class ResetTokenButton extends Component {
    constructor(props){  
      super(props);  
      this.state = { showPopup: false };  
    }

  state = {
    redirect: false,
    navigator: false,
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

  resetToken = () => {
    let token = localStorage.getItem('token');
    let togo_id = localStorage.getItem('togo_id');
    fetch('http://localhost:8000/users/' + togo_id + '/deletetoken?token=' + token)
    .then((response) => {return response.json()})
    .then((jsondata) => {
      if(Object.keys(jsondata).includes('detail')){
        let redirectAddress = handleError(jsondata['detail'])
        if(redirectAddress){
          this.setState({navigator: redirectAddress})
        }
      }
      else{
        localStorage.removeItem('token');
        this.setRedirect();
      }
    }
    )
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
    this.resetToken();
  }


  render() {
    return (
    <div>
      {this.renderNavigator()}
        {this.renderRedirect()}
        <button onClick={this.togglePopup.bind(this)} className='danger_button' >RESET TOKEN</button>
        {this.state.showPopup ? <ConfirmPopup text='WARNING: YOU ARE ABOUT TO RESET YOUR ACCESS TOKEN, ARE YOU SURE?'
        cancelPopup={this.togglePopup.bind(this)} confirmPopup={this.confirm}/> : null}
    </div>
  );
  }
}

export default ResetTokenButton;