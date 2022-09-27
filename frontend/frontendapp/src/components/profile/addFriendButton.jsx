import {React, Component} from 'react';

class AddFriendButton extends Component {


    addFriend = () => {
        fetch('http://localhost:8000/users/' + this.props.friend_id + '/request?token=' + localStorage.getItem('token'))
        .then((response) => {return response.json();})
        .then((r) => {window.location.reload();}) 
    }


  render() {
    return (
    <div>
        <button onClick={this.addFriend}>ADD FRIEND</button>
    </div>
  );
  }
}

export default AddFriendButton;