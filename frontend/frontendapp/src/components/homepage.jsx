import React, { Component } from 'react';  
import ConfirmPopup from './popup';

class Homepage extends Component {
    constructor(props){  
        super(props);  
        this.state = { showPopup: false };  
    }


    togglePopup() {  
        this.setState({showPopup: !this.state.showPopup});  
    }

    confirm = () => {
        alert('CONFIRMED');
        this.setState({showPopup: !this.state.showPopup}); 
    }
    
    
    render() {  
        return (  
            <div>  
                <h1> Simple Popup Example </h1>  
                <button onClick={this.togglePopup.bind(this)}> Click To Open</button>
                {this.state.showPopup ? <ConfirmPopup text='TEXT BRO'
                cancelPopup={this.togglePopup.bind(this)} confirmPopup={this.confirm}/> : null}  
            </div>
        );  
    }  
}


export default Homepage;