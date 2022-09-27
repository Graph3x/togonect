import React, { Component } from 'react';
import FriendCard from './friendCard';
import FrqCard from './frqCard';


class FriendsPage extends Component {

    state = {
        friends : [],
        id : 'None',
        frqs: [],
        valid_frqs: [],
    }

  componentDidMount() {
    this.setState({'id' : localStorage.getItem('togo_id')})
    this.getFriends(localStorage.getItem('togo_id'));
    this.getFrqs();
  }

  getFriends = (iden) => {
    fetch('http://localhost:8000/users/' + iden.toString() + '/friends?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
    .then((jsondata) => {this.setState({friends:jsondata})})
  }

  getFrqs = () => {
    fetch('http://localhost:8000/frequests?token=' + localStorage.getItem('token'))
    .then((response) => {return response.json();})
    .then((jsondata) => {this.setState({frqs: jsondata}); return jsondata})
    .then((jsondata) => {this.getValidFrqs(jsondata)})
    
  }


  getValidFrqs = (frqs) => {
    let nfrqs = []
    for (let i in frqs){
        if(frqs[i].status == 'pending'){ 
            nfrqs.push(frqs[i]) 
        }
    }
    this.setState({valid_frqs: nfrqs})
    
  }
    
    render() {  
        return (  
            <div>  
                <h1> FRIENDS </h1> 
                {this.state.friends.map(f => <FriendCard iden={f.friend_id} key={f.friend_id}/>)}
                {this.state.valid_frqs.map(f => <FrqCard frq={f} user={this.state.id} key={f.id}/>)}
            </div>
        );  
    }  
}


export default FriendsPage;