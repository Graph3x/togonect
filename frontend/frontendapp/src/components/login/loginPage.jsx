import React, {Component} from "react";
import LoginBlock from "./loginBlock";
import logo from "../../imgs/logo512.png"

class LoginPage extends Component {


    render() {
        return (
        <div id='login-page' className='container center'>
            <div id='inner-login'>
                <div id="login-logo-holder">
                    <img src={logo} id='login-logo'/>
                </div>
                <h1 className="container center">Welcome to Togonect</h1>
                <h2 id='login-with' className="container center"> login with:</h2>
                <div className="container center" id='login-block-holder'>
                <LoginBlock/>
                </div>
            </div>
        </div>
        )
    }

}

export default LoginPage;