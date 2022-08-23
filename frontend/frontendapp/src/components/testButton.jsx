import {React, Component} from 'react';


const temp = () =>{
  fetch('http://localhost:8000/?token=' + localStorage.getItem('token'))
  .then((response) => {return response.json();})
  .then((jsondata) => {alert(jsondata);})
}

class TestButton extends Component {
  render() {
    return (
    <button onClick={temp}>TEST</button>
  );
  }
}

export default TestButton;