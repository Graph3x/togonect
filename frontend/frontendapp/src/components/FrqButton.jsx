import {React, Component} from 'react';

class FrqButton extends Component {

  state = {done: false}

    modifyFrq = () => {
        fetch('http://localhost:8000/frequests/' + this.props.frq_id + '/' + this.props.command + '?token=' + localStorage.getItem('token'))
        .then((response) => {this.setState({done: true})})
    }

    reload = () => {
      if(this.state.done) {window.location.reload();}
    }


  render() {
    return (
    <div>
        {this.reload()}
        <button onClick={this.modifyFrq}>{this.props.command}</button>
    </div>
  );
  }
}

export default FrqButton;