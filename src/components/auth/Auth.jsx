import React from 'react';
import { connect } from 'react-redux';

import axios from 'axios';
import cookie from 'react-cookies';

class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user_id: 0,
      user_email: '',
      password: '',
      auth: props.auth,
      error: '',
      success: ''
    };
    
  }

  componentWillMount() {
    // console.log('cookie.load');
    // console.log(cookie.loadAll());
  }

  check() {
    //console.log(cookie.load('user'));
    axios.post('/api/signcheck', { email: this.refs.email.value, password: this.refs.password.value })
    .then(response => {
      console.log(response);
      this.state =  { userId: cookie.load('userId') }
    });
  }

  onLogin(userId) {
    this.setState({ userId })
    cookie.save('userId', userId, { path: '/' })
  }
 
  onLogout() {
    cookie.remove('userId', { path: '/' })
  }

  validateForm() {
    let err = '';
    let reg = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
    if(!this.refs.email.value.match(reg)) err += "Wrong EMail. ";
    if(this.refs.password.value.length < 6) err += 'Password field sholud contain at least 6 symbols. ';
    return err;
  }

  signin(e) {
    e.preventDefault();

    let err = '';
    err = this.validateForm();
    if ( err > '') {
      this.setState({ error: err});
    } 
    else {
      //this.refs.email.value = 'shit';
      axios.post('/api/signin', { email: this.refs.email.value, password: this.refs.password.value })
      .then(response => {
        console.log(response);
        //this.props.onAuth(response.data.email);
        if(response && response.data.id > 0) {
          this.setState({
            success: 'Hello, ' + response.data.email + '. You\'re welcome!', 
            user_id: response.data.id, 
            user_email: response.data.email,
            user_token: response.data.token,
            auth: true,
            error: ''
          });

          localStorage.setItem('user', JSON.stringify(response.data));
          
          dispatch({ type: AUTH_USER });
        }
        else {
          this.setState({
            error: 'EMail or password is wrong.',
            auth: false
          });

        }
      })
      .catch(this.handleError);
    }
  }

  signup(e) {
    e.preventDefault();
    //console.log(this.refs.email.value + this.refs.password.value);
    axios.post('/api/signup', { email: this.refs.email.value, password: this.refs.password.value })
            .then(response => {
              console.log(response.data);
              //alert(response.data);
              if(response && response.data.id > 0) {
                this.setState({
                  success: 'Congratulations! Your EMail '+response.data.email+' is registered and authorizated!',
                  user_id: response.data.id, user_email: response.data.email,
                  auth: true
                });
              }
              else this.setState({
                error: 'User is already registered.',
                user_id: 0
              }); //this.state.error = 'User is already registered.';
              
            })
            .catch(this.handleError);
  }

  remind(e) {

  }

  fb_login(e) {

  }

  validateEmail(event){
    let value = event.target.value;
    let reg = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
    this.state.validEmailClass = value.match(reg) !== null;
    this.state.validEmailClass ? this.state.disabled = "disabled" : this.state.disabled = '';
    this.setState({email: value});
  }

  validatePassword(event){
    let value = event.target.value;
    this.state.validPassClass = value.length >= 6;
    this.state.validPassClass ? this.state.disabled = "disabled" : this.state.disabled = '';
    this.setState({password: value});
  }

  handleError(e){
        console.error(e);
        this.state.error = e;
  }

  render() {
    return (
      this.props.user == ''
      ?
    <section className="content">
      <h1 className="mdl-typography--display-1">Sign In</h1>
      <div className="button" role="button" onClick={this.fb_login.bind(this)}>Login with Facebook</div>
      <br /><br /><br /><br />
      {this.state.user_email}
      <p>EMail</p>
      <form role="form" onSubmit={this.signin.bind(this)} className="form-auth">
          <div className="form-group">
            <input type="email" defaultValue="alex@mail.com" ref="email" placeholder="EMail" required 
              value={this.state.email}
              onChange={this.validateEmail.bind(this)} 
              className={"valid_" + this.state.validEmailClass}/><br />
            <input type="password" defaultValue="123456" ref="password" placeholder="Password" required
              onChange={this.validatePassword.bind(this)} 
              className={"valid_" + this.state.validPassClass}/>
          </div>
          <div className="button" role="button" onClick={this.signin.bind(this)}>Sign In</div>
          <div className="button" role="button" onClick={this.signup.bind(this)}>Sign Up</div>
          <div className="button" role="button" onClick={this.remind.bind(this)}>Forgot Your Password?</div>
          <div className="clr"></div>
      </form>
      { this.state.error > '' ? <div className="error">{this.state.error}</div> : <br /> }
    </section>
    :
      <div className="success"> {this.state.success} </div>
    );
  }
}

function mapStateToProps (state) {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(Auth);