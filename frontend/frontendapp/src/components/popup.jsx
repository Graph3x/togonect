import React from 'react';  
import '../styles.css'


class ConfirmPopup extends React.Component {  
    render() {  
        return (  
            <div className='popup'>  
                <div className='popup_open'>  
                    <h1>{this.props.text}</h1>  
                    <button onClick={this.props.cancelPopup}>NO</button>
                    <button onClick={this.props.confirmPopup}>YES</button>  
                </div>  
            </div>  
        );  
    }  
}


export default ConfirmPopup;