import {React, Component} from 'react';


const logout = () => {localStorage.removeItem('token');}


class LogoutButton extends Component {
  render() {
    return (
    <button onClick={logout}>LOGOUT</button>
  );
  }
}

export default LogoutButton;