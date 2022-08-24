import {React, Component} from 'react';
import { Navigate } from 'react-router-dom'


const temp = () =>{
  fetch('http://localhost:8000/?token=' + localStorage.getItem('token'))
  .then((response) => {return response.json();})
  .then((jsondata) => {alert(jsondata);})
}



class TestButton extends Component {
  state = {
    redirect: false
  }

  setRedirect = () => {
    this.setState({redirect: true})
  }

  renderRedirect = () => {
    if (this.state.redirect)
    {
      return(<Navigate to='/'/>)
    }
  }


  render() {
    return (
      <div>
        {this.renderRedirect()}
        <button onClick={this.setRedirect}>TEST</button>
      </div>
    
  );
  }
}

export default TestButton;