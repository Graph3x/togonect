import {React, Component} from 'react';
import handleError from '../common/handleError'
import { Navigate } from 'react-router-dom';


class AddFriendButton extends Component {

  state = {
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


    addFriend = () => {
      fetch('http://localhost:8000/users/' + this.props.friend_id + '/request?token=' + localStorage.getItem('token'))
      .then((response) => {return response.json();})
      .then((jsondata) => {
      if(Object.keys(jsondata).includes('detail')){
        let redirectAddress = handleError(jsondata['detail'])
        if(redirectAddress){
          this.setState({navigator: redirectAddress})
        }
      }
      else{
        window.location.reload();
      }
    }
    )
    }


  render() {
    return (
    <div>
      {this.renderNavigator()}
      <button onClick={this.addFriend}>ADD FRIEND</button>
    </div>
  );
  }
}

export default AddFriendButton;