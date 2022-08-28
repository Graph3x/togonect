import {React, Component} from 'react';
import { NavLink } from 'react-router-dom';
import FrqButton from './FrqButton';


class FrqCard extends Component {

    state = {
        other_id: 0,
        is_recipient: false,
        userdata: []
    }

    componentDidMount() {
        let other_id = this.getOtherId();
        this.getProfile(other_id);
        
    }

    getProfile = (oid) => {
        fetch('http://localhost:8000/users/' + oid.toString())
        .then((response) => {return response.json();})
        .then((jsondata) => {this.setState({userdata:jsondata})})
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
            <img src={this.state.userdata.profile_picture} alt='Profile picture' height={100} width={100}/>
        </NavLink>
        {this.renderFrqCard()}
    </div>
  );
  }
}

export default FrqCard;