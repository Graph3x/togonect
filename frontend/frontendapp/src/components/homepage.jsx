import React, { Component } from 'react';  
import InviteCard from './invites/inviteCard';
import { NavLink, Navigate } from 'react-router-dom';
import handleError from './common/handleError'

class Homepage extends Component {


    state = {
        invites : [],
        userdata: [],
        navigator: false,

    }

  componentDidMount() {
    this.getInvites();
    this.getProfile(localStorage.getItem('togo_id'));
  }

  getInvites = () => {
    fetch('http://localhost:8000/invites?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
    .then((jsondata) => {
      if(Object.keys(jsondata).includes('detail')){
        let redirectAddress = handleError(jsondata['detail'])
        if(redirectAddress){
          this.setState({navigator: redirectAddress})
        }
      }
      else{
        this.setState({invites:jsondata});
      }
    }
    )
  }

  getProfile = (iden) => {
    fetch('http://localhost:8000/users/' + iden + '/full?token=' + localStorage.getItem('token'))
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
                {this.renderAddInv()}
                <div id='invites_div'>
                  {this.renderInvite()}
                  {this.state.invites.map(i => this.renderInvites(i))}
                  {this.renderNavigator()}
                </div>
                
            </div>
        );  
    }  
}


export default Homepage;