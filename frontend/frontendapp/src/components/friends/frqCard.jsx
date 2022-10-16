import {React, Component} from 'react';
import { NavLink, Navigate} from 'react-router-dom';
import FrqButton from './FrqButton';
import handleError from '../common/handleError';


class FrqCard extends Component {

    state = {
        other_id: 0,
        is_recipient: false,
        userdata: [],
        navigator: false,
    }

    componentDidMount() {
        let other_id = this.getOtherId();
        this.getProfile(other_id);
        
    }

    getProfile = (oid) => {
        fetch('http://localhost:8000/users/' + oid.toString())
        .then((response) => {return response.json();})
        .then((jsondata) => {
        if(Object.keys(jsondata).includes('detail')){
            let redirectAddress = handleError(jsondata['detail'])
            if(redirectAddress){
            this.setState({navigator: redirectAddress})
            }
        }
        else{
            this.setState({userdata:jsondata});
        }
        }
        )
    }


    getOtherId = () => {
        if(this.props.frq.recipient == this.props.user){
            this.setState({is_recipient: true});
            this.setState({other_id: this.props.frq.sender});
            return this.props.frq.sender
        }
        else {
            this.setState({other_id: this.props.frq.recipient});
            return this.props.frq.recipient
        }
        
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


    renderFrqCard = () => {
        if(this.state.is_recipient)
        {
            return (
                <>
                    <FrqButton frq_id={this.props.frq.id} command={'accept'}/>
                    <FrqButton frq_id={this.props.frq.id} command={'reject'}/>
                </>
            )
        }
        else {
            return (
                <>
                    <FrqButton frq_id={this.props.frq.id} command={'cancel'}/>
                </>
            )
        }
    }


  render() {
    return (
    <div>
        <NavLink to={'/profile/' + this.state.other_id}>
            <img src={this.state.userdata.profile_picture} alt='Profile picture' height={100} width={100} referrerPolicy="no-referrer"/>
        </NavLink>
        {this.renderFrqCard()}
        {this.renderNavigator()}
    </div>
  );
  }
}

export default FrqCard;