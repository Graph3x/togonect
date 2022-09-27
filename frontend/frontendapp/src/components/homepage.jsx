import React, { Component } from 'react';  
import InviteCard from './invites/inviteCard';
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

  renderInvites = (inv) => {
    if (this.state.userdata.invite == null) {
      return <InviteCard invite={inv} udata={this.state.userdata} key={inv.id}/>
    }

    if(this.state.userdata.invite.id !== inv.id){
        return <InviteCard invite={inv} udata={this.state.userdata} key={inv.id}/>
    }

  }


    render() {  
        return (  
            <div>
                {this.renderAddInv()}
                <div id='invites_div'>
                  {this.renderInvite()}
                  {this.state.invites.map(i => this.renderInvites(i))}
                </div>
                
            </div>
        );  
    }  
}


export default Homepage;