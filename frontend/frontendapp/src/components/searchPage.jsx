import React from 'react';  
import '../styles.css'
import { NavLink, Navigate } from 'react-router-dom';
import handleError from './common/handleError';

class SearchPage extends React.Component {  

    state = {
        value: '',
        results: [],
        navigator: false,
    }

    handleChange = (event) => {this.setState({value: event.target.value})}

    search = (event) => {
        event.preventDefault()
        fetch('http://localhost:8000/search?token=' + localStorage.getItem('token') + '&query=' + this.state.value)
        .then((response) => {return response.json();})
        .then((jsondata) => {
        if(Object.keys(jsondata).includes('detail')){
            let redirectAddress = handleError(jsondata['detail'])
            if(redirectAddress){
            this.setState({navigator: redirectAddress})
            }
        }
        else{
            this.setState({results: jsondata})
        }
        }
        )
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
                {this.renderNavigator()}

            </div>  
        );  
    }  
}


export default SearchPage;