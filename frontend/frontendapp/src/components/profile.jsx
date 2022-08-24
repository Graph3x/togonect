import {React, Component} from 'react';
import { useParams } from 'react-router-dom';


function withParams(Component) {
    return props => <Component {...props} params={useParams()}/>;
}


class Profile extends Component {

    state = {
        userdata : 'None',
        id : 'None'
    }

  componentDidMount() {
    let { iden } = this.props.params;
    this.setState({'id' : iden})
    this.getProfile(iden);
  }

  getProfile = (iden) => {
    fetch('http://localhost:8000/users/' + iden.toString())
    .then((response) => {return response.json();})
    .then((jsondata) => {this.setState({userdata:jsondata})})
  }


  options = () => {
    alert('TODO')
  }


  edit = () => {
    alert('TODO')
  }

  renderEdit = () => {
    if(this.state.id == localStorage.getItem('togo_id')) {
      return <button onClick={this.edit}>EDIT</button>
    } 
  }


  render() {
    return (
        <div id='profile'>
            <button onClick={this.options}>OPTIONS</button>
            {this.renderEdit()}
            <img src={this.state.userdata.profile_picture} alt='Profile picture' height={300} width={300}/>
            <h1>{this.state.userdata.username}</h1>
        </div>
  );
  }
}


export default withParams(Profile);