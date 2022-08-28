import {React, Component} from 'react'

class UnFriendButton extends Component {

  state = {
    done: false,
  }

  unFriend = () => {
    fetch('http://localhost:8000/users/' + this.props.friend_id + '/unfriend?token=' + localStorage.getItem('token'))
    .then((response) => {this.setState({done: true})})
  }

  reload = () => {
      if(this.state.done) {window.location.reload();}
    }


  render() {
    return (
    <div>
      {this.reload()}
      <button onClick={this.unFriend}>UNFRIEND</button>
    </div>
  );
  }
}

export default UnFriendButton;