import {React, Component} from 'react';
import { Navigate } from 'react-router-dom';
import handleError from '../common/handleError';


class AddInvPage extends Component {

    state = {
        value : '',
        redirect: false,
        stage: 0,
        game: '',
        useSlots: true,
        slots: 5,
        time: null,
        userdata: '',
        games: [],
        navigator: false,
    }


  handleChange(event) {this.setState({value: event.target.value});}


  componentDidMount() {
    this.getProfile(localStorage.getItem('togo_id'));
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
        this.setState({games:jsondata.games});
      }
    }
    )
  }


  setRedirect = () => {
    this.setState({redirect: true})
  }


  renderRedirect = () => {
    if (this.state.redirect)
    {
      let path = '/homepage/';
      return(<Navigate to={path}/>);
    }
  }

  handleSave = () => {

    let rbody = { game_id : this.state.game}
    if (this.state.useSlots) {
      rbody['slots'] = this.state.slots;
    }
    if(this.state.value != '') {
      rbody['time'] = this.state.value
    }
    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rbody)
      }
      let path = 'http://localhost:8000/invites/add?token=' + localStorage.getItem('token'); 
    fetch(path, requestOptions)
    .then((response) => {return response.json()})
    .then((jsondata) => {
      if(Object.keys(jsondata).includes('detail')){
        let redirectAddress = handleError(jsondata['detail'])
        if(redirectAddress){
          this.setState({navigator: redirectAddress})
        }
      }
      else{
        this.setRedirect();
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


  setGame = (iden) => {
    this.setState({game: iden});
    this.setState({stage: 1});
  }


  gameElement = (game) => {
    return(
        <button key={game.id} onClick={() => this.setGame(game.id)}><img src={game.cover}></img></button>
    )
  }


  minusButton = () => {
    if(this.state.slots > 1) {
      this.setState({slots: this.state.slots - 1})
    }    
  }

  unlimitedButton = () => {
    if(this.state.useSlots){
      return <button className='btn' onClick={() => {this.setState({useSlots: !this.state.useSlots})}}>UNLIMITED</button>
    }
    return <button className='btn' onClick={() => {this.setState({useSlots: !this.state.useSlots})}}>LIMITED</button>
  }

  slotsSelector = () => {
    if(this.state.useSlots){
      return (
        <div>
          <button  className='btn' onClick={() => {this.setState({slots: this.state.slots + 1})}}>+</button>
          <h3>{this.state.slots}</h3>
          <button className='btn' onClick={this.minusButton}>-</button>
        </div>
      )
    }
  }

  renderTimeSelector = () => {
    if(this.state.value){
      console.log(this.state.value)
      let now = Date.now()
      let picked = new Date(this.state.value)
      console.log(picked)
      if(picked <= now){
        return <p>Date cant be in the past</p>
      }
    }
    return <button onClick={this.handleSave}>SEND</button>
    
  }


  render() {

    if(this.state.stage == 0) {
        return (
            <div id='game'>
              {this.renderNavigator()}
              <h2 className='title'>SELECT GAME</h2>
                {this.state.games.map(g => this.gameElement(g))}
            </div>
        )
    }

    if(this.state.stage == 1) {

        return (
            <div id='slots'>
              {this.renderNavigator()}
              <h2 className='title'>SELECT NUMBER OF PLAYERS</h2>
              {this.slotsSelector()}
              {this.unlimitedButton()}
              <button className='btn' onClick={() => {this.setState({stage: this.state.stage + 1})}}>NEXT</button>
            </div>
        )
    }


    if(this.state.stage == 2) {
        return (
            <div id='time'>
              {this.renderRedirect()}
              {this.renderNavigator()}
              <h2>Pick time or no time</h2>
              <input type="datetime-local" value={this.state.value} onChange={(e) => this.handleChange(e)}
              id="time_selector"/>
              {this.renderTimeSelector()}
            </div>
        )
    }

    return (
        <div id='edit'>
          {this.renderNavigator()}
          <p>Unknown error</p>
        </div>

  );
  }
}


export default AddInvPage