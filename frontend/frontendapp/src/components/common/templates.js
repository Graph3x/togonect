  testFunc = () => {
    fetch('http://localhost:8000/users/getid?token=pepeugandawarrior@seznam.czD0PIU0S6UPWU2JN6U4P2WXT5LI7B7JA2IAPKCWMMHGRWU96NBGFHTVWOOEFI4QZQK7AAJ6KPOXV800HCFQRSVF35F82YQ2RABLKCWED4FB8BC9N4EYSU8LP9G79317XAC7JB27456KLF6DMRKJ58TS5WE280PVU5NUIULCMJDCLI0SEOG8Y583EJG821XODHODK3HSQY47SVXJPW2XEW4GJ3M61BPI9EQN8TVUSX21MRFXBFGW2UMPCPLD1I32V8X')
    .then((response) => {return response.json()})

    
    .then((jsondata) => {
      if(Object.keys(jsondata).includes('detail')){
        let redirectAddress = handleError(jsondata['detail'])
        if(redirectAddress){
          this.setState({navigator: redirectAddress})
        }
      }
      else{
        console.log('valid')
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
