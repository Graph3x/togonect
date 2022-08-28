import React, { Component } from 'react';  
import ConfirmPopup from './popup';

class Homepage extends Component {
    
    reloadPage = () => {}

    render() {  
        return (  
            <div>  
                <button onClick={this.reloadPage}>RELOAD</button>
            </div>
        );  
    }  
}


export default Homepage;