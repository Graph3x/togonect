import {React, Component, Fragment} from 'react';
import { useParams, Navigate } from 'react-router-dom';
import DeleteUserButton from './deleteUserButton';
import ResetTokenButton from './resetTokenButton';


function withParams(Component) {
    return props => <Component {...props} params={useParams()}/>;
}


class EditPage extends Component {

    state = {
        userdata : 'None',
        id : 'None',
        value : '',
        redirect: false
    }

  componentDidMount() {
    let { iden } = this.props.params;
    this.setState({id : iden});
    this.getProfile(iden);
    this.handleChange = this.handleChange.bind(this)
  }

  getProfile = (iden) => {
    fetch('http://localhost:8000/users/' + iden.toString())
    .then((response) => {return response.json();})
    .then((jsondata) => {this.setState({userdata:jsondata})})
  }

  handleChange(event) {this.setState({value: event.target.value});}


  setRedirect = () => {
    this.setState({redirect: true})
  }


  renderRedirect = () => {
    if (this.state.redirect)
    {
      let path = '/profile/' + this.state.id;
      return(<Navigate to={path}/>);
    }
  }

  handleSave = () => {
    if(this.state.value) {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.state.value })
      }
      let path = 'http://localhost:8000/users/' + this.state.id + '/edit?token=' + localStorage.getItem('token'); 
      fetch(path, requestOptions)
    }
    this.setRedirect();
  }

  temp = () => {if(this.state.value) {alert('yep')}}
  

  render() {
    return (
      <Fragment>
        <div id='edit'>
          {this.renderRedirect()}
          <form>        
            <input type="text" value={this.state.value} onChange={this.handleChange} placeholder={this.state.userdata.username}/>
          </form>
          <button onClick={this.handleSave}>SAVE</button>
        </div>
        <div id='danger_edit'>
          <br/>
          <ResetTokenButton/>
          <DeleteUserButton/>

        </div>
      </Fragment>
  );
  }
}


export default withParams(EditPage);