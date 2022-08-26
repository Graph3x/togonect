import {React, Component} from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import OptionsMenu from './optionsMenu';


function withParams(Component) {
    return props => <Component {...props} params={useParams()}/>;
}


class Profile extends Component {

    state = {
        userdata : 'None',
        id : 'None',
        render_options: false,
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
    if(this.state.render_options){this.setState({render_options: false})}
    else {this.setState({render_options: true})}
  }


  renderEdit = () => {
    if(this.state.id == localStorage.getItem('togo_id')) {
      let path = '/profile/' + localStorage.getItem('togo_id') + '/edit'
      return <Link to={path}>EDIT</Link>
    } 
  }


  renderOptions = () => {
    if (this.state.render_options)
    {
      return <OptionsMenu/>
    }
  }


  render() {
    return (
        <div id='profile'>
            <button onClick={this.options}>OPTIONS</button>
            {this.renderOptions()}
            {this.renderEdit()}
            <br/>
            <img src={this.state.userdata.profile_picture} alt='Profile picture' height={300} width={300}/>
            <h1>{this.state.userdata.username}</h1>
        </div>
  );
  }
}


export default withParams(Profile);