import React from 'react';  
import '../styles.css';
import { NavLink } from 'react-router-dom';


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


class SelectGameAddPopup extends React.Component {  
    constructor (props){
        super(props);
    }
    state = {
        value: '',
        games: [],
    }

    handleChange = (event) => {this.setState({value: event.target.value})}

    serachGame = (event) => {
        event.preventDefault()
        fetch('http://localhost:8000/games/search?name=' + this.state.value)
        .then((response) => {return response.json();})
        .then((jsondata) => {this.setState({games: jsondata})})
    }

    render() {  
        return (  
            <div className='popup'>  
                <div className='popup_open'>  
                    <h1>Add a game:</h1> 
                    <form>        
                        <input type="text" value={this.state.value} onChange={this.handleChange}/>
                        <button onClick={this.serachGame}>SEARCH</button>
                        <button onClick={this.props.cancelPopup}>CLOSE</button>
                        {this.state.games.map(g => <NavLink key={g.id} to={'/games/' + g.id}>{g.name}</NavLink>)}
                    </form>
                </div>  
            </div>  
        );  
    }  
}


export default ConfirmPopup;
export {SelectGameAddPopup};