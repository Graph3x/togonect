import React, { Component } from 'react';  
import InviteCard from './inviteCard';
import { NavLink } from 'react-router-dom';

class Homepage extends Component {


    state = {
        invites : [],
        userdata: [],

    }

  componentDidMount() {
    this.getInvites();
    this.getProfile(localStorage.getItem('togo_id'));
  }

  getInvites = () => {
    fetch('http://localhost:8000/invites?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
    .then((jsondata) => {this.setState({invites:jsondata}); return jsondata})
  }

  getProfile = (iden) => {
    fetch('http://localhost:8000/users/' + iden + '/full?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
    .then((jsondata) => {this.setState({userdata:jsondata}); return jsondata})
  }


  renderInvite = () => {
    if(this.state.userdata.invite){
      return <InviteCard invite={this.state.userdata.invite} udata={this.state.userdata}/>
    }
  }


  renderAddInv = () => {
    if(this.state.userdata.invite == null) {
      return <NavLink to={'/sendinv'} className='btn' id='send_inv_btn'>SEND INVITE</NavLink>
    }
  }


    render() {  
        return (  
            <div>
                {this.renderAddInv()}
                <div id='invites_div'>
                  {this.renderInvite()}
                  {this.state.invites.map(i => <InviteCard invite={i} udata={this.state.userdata} key={i.id}/>)}
                </div>
                
            </div>
        );  
    }  
}


export default Homepage;