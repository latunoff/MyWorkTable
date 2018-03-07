import React from 'react';
import { connect } from 'react-redux';

import axios from 'axios';
import cookie from 'react-cookies';

import { AUTH } from '../../constants/auth';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Auth extends React.Component {

  constructor(props) {
    super(props);
    //console.log(props);
    this.state = {
      user: props.user,
      auth: props.user != undefined && props.user.id != undefined,
    };
    //console.log(this.state);
  }

  componentWillUpdate(){
    this.state = {
      user: this.props.user,
      auth: this.props.auth
    };
  }

  componentDidMount() {
    this.setState(this.state);
  }

  check() {
    //console.log(cookie.load('user'));
    axios.post('/api/signcheck', { email: this.refs.email.value, password: this.refs.password.value })
    .then(response => {
      console.log(response);
      this.state =  { userId: cookie.load('userId') }
    });
  }

  // onLogin(userId) {
  //   this.setState({ userId })
  //   cookie.save('userId', userId, { path: '/' })
  // }
 
  onLogout(e) {
    e.preventDefault();
    axios.post('/api/signout', this.state.user)
    .then(response => {
      //console.log(response);
      this.props.onAuth({});
      localStorage.removeItem('user');
      cookie.remove('userToken', { path: '/' })
      location.href = '/';
    });
  }

  validateForm() {
    let err = '';
    let reg = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
    if (!this.refs.email.value.match(reg)) err += "Wrong EMail. ";
    if (this.refs.password.value.length < AUTH.PASSWORD_MIN) err += 'Password field sholud contain at least ' + AUTH.PASSWORD_MIN + ' symbols. ';
    if (this.refs.password.value.length > AUTH.PASSWORD_MAX) err += 'Password field sholud contain no more ' + AUTH.PASSWORD_MAX + ' symbols. ';
    return err;
  }

  signin(e) {
    e.preventDefault();

    if (!this.props.auth)
    {
      let err = '';
      err = this.validateForm();
      if ( err > '') {
        this.setState({ error: err });
      }
      else {
        axios.post('/api/signin', { email: this.refs.email.value, password: this.refs.password.value })
        .then(response => {
          //console.log(response);
          if(response && response.data.id > 0) {
            let user = response.data;
            
            this.props.onAuth(user);
            localStorage.setItem('user', JSON.stringify(response.data));
            cookie.save('userToken', user.token, { path: '/' });
            location.href = '/';
            
            //dispatch({ type: AUTH_USER });
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
  }

  signup(e) {
    e.preventDefault();

    if (!this.props.auth)
    {
      //console.log(this.refs.email.value + this.refs.password.value);
      axios.post('/api/signup', { email: this.refs.email.value, password: this.refs.password.value })
      .then(response => {
        console.log(response.data);
        //alert(response.data);
        if(response && response.data.id > 0) {
          //success: 'Congratulations! Your EMail '+response.data.email+' is registered and authorizated!',
          let user = response.data;
            
          this.props.onAuth(user);
          localStorage.setItem('user', JSON.stringify(response.data));
          cookie.save('userToken', user.token, { path: '/' });
        }
        else this.setState({
            error: 'User is already registered.',
            user_id: 0,
            auth: false
          }); //this.state.error = 'User is already registered.';
        
      })
      .catch(this.handleError);
    }
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
    this.state.validPassClass = value.length >= AUTH.PASSWORD_MIN && value.length < AUTH.PASSWORD_MAX;
    this.state.validPassClass ? this.state.disabled = "disabled" : this.state.disabled = '';
    this.setState({password: value});
  }

  handleError(e){
        console.error(e);
        this.state.error = e;
  }

  render() {
    //console.log(this.state);
    /*
    <div className="button" role="button" onClick={this.fb_login.bind(this)}>Login with Facebook {this.state.user.email}</div>
      <br />
    */
    let link_class = this.props.isLink != undefined ? 'mdl-navigation__link' : 'false';
    return (
      !this.props.auth
      ?
    <ReactCSSTransitionGroup component="section" className="auth"
    transitionName="slide" transitionEnterTimeout={3000} transitionLeaveTimeout={3000}
    transitionAppear={true} transitionAppearTimeout={7000}
    transitionEnter={true} transitionLeave={true}>
      <br />
      <h3 className="mdl-typography--display-1">Sign In</h3>
      {this.state.user_email}
      <form role="form" onSubmit={this.signin.bind(this)} className="form-auth">
          <div className="form-group">
            <input type="email" defaultValue="" ref="email" placeholder="EMail" required 
              value={this.state.email}
              onChange={this.validateEmail.bind(this)} 
              className={"valid_" + this.state.validEmailClass}/><br />
            <input type="password" defaultValue="" ref="password" placeholder="Password" required
              onChange={this.validatePassword.bind(this)} 
              className={"valid_" + this.state.validPassClass}/>
          </div>
          <div className="button" role="button" onClick={this.signin.bind(this)}>Sign In</div>
          <div className="button" role="button" onClick={this.signup.bind(this)}>Sign Up</div>
          <div className="button" role="button" onClick={this.remind.bind(this)}>Forgot Your Password?</div>
          <div className="clr"></div>
      </form>
      { this.state.error > '' ? <div className="error">{this.state.error}</div> : <br /> }
    </ReactCSSTransitionGroup>
    :
      <a href="#" className={link_class} onClick={this.onLogout.bind(this)}>Sign out</a>
    );
  }
}

function mapStateToProps (state) {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps)(Auth);