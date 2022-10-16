import {React, Component} from 'react';
import handleError from '../common/handleError';
import { Navigate } from 'react-router-dom';

class FrqButton extends Component {

  state = {
    done: false,
    navigator: false,
  }

  modifyFrq = () => {
        fetch('http://localhost:8000/frequests/' + this.props.frq_id + '/' + this.props.command + '?token=' + localStorage.getItem('token'))
        .then((jsondata) => {
        if(Object.keys(jsondata).includes('detail')){
          let redirectAddress = handleError(jsondata['detail'])
          if(redirectAddress){
            this.setState({navigator: redirectAddress})
          }
        }
        else{
          this.setState({done: true})
        }
      }
      )
    }

  reload = () => {
      if(this.state.done) {window.location.reload();}
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


  render() {
    return (
    <div>
        {this.reload()}
        <button onClick={this.modifyFrq}>{this.props.command}</button>
        {this.renderNavigator()}
    </div>
  );
  }
}

export default FrqButton;