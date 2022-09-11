import React from 'react';  
import '../styles.css'
import { NavLink } from 'react-router-dom';

class SearchPage extends React.Component {  

    state = {
        value: '',
        results: [],
    }

    handleChange = (event) => {this.setState({value: event.target.value})}

    search = (event) => {
        event.preventDefault()
        fetch('http://localhost:8000/search?token=' + localStorage.getItem('token') + '&query=' + this.state.value)
        .then((response) => {return response.json();})
        .then((jsondata) => {this.setState({results: jsondata})})
    }

    

    renderUsersEmail = () => {
        let emailedUsr = this.state.results[0]
        if(emailedUsr) {
            return emailedUsr.map(u => <NavLink key={u.id} to={'/profile/' + u.id}><img src={u.profile_picture} alt='user'/></NavLink>)
        }
    }


    renderUsersName = () => {
        let named = this.state.results[1]
        if(named) {
            return named.map(u => <NavLink key={u.id} to={'/profile/' + u.id}><img src={u.profile_picture} alt='user'/></NavLink>)
        }
    }


    renderGames = () => {
        let games = this.state.results[2]
        if(games) {
            return games.map(g => <NavLink key={g.id} to={'/games/' + g.id}>{g.name}</NavLink>)
        }
    }

    render() {  
        return (  
            <div>  
                <h1>Search:</h1> 
                <form>        
                    <input type="text" value={this.state.value} onChange={this.handleChange}/>
                    <button onClick={this.search}>SEARCH</button>
                </form>
                {this.renderUsersEmail()}
                {this.renderUsersName()}
                {this.renderGames()}
            </div>  
        );  
    }  
}


export default SearchPage;