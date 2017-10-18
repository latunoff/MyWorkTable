import React from 'react';
import axios from 'axios';

export default class Auth extends React.Component {

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

  validateForm(e, p){
    let err = '';
    let reg = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
    if(!e.match(reg)) err += "Wrong EMail. ";
    if(p.length < 6) err += 'Password field sholud contain at least 6 symbols. ';
    return err;
  }

  signin(e) {
    e.preventDefault();

    let err = '';
    err = this.validateForm(this.refs.email.value, this.refs.password.value);
    if( err > '') {
      this.setState({ error: err});
    }else{
      axios.post('/api/signin', { email: this.refs.email.value, password: this.refs.password.value })
              .then(response => {
                //console.log(response);
                //this.props.onAuth(response.data.email);
                if(response && response.data.id > 0){
                  this.setState({
                    success: 'Hello, ' + response.data.email + '. You\'re welcome!', 
                    user_id: response.data.id, 
                    user_email: response.data.email,
                    auth: true
                  });
                }
                else {
                  this.setState({
                    error: 'User not found, EMail or password is wrong.',
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

  handleError(e){
        console.error(e);
        this.state.error = e;
    }

  render() {
    return (
      !this.state.auth
      ?
    <section className="content">
      <h1 className="mdl-typography--display-1">Sign In</h1>
      <div className="button" role="button" onClick={this.fb_login.bind(this)}>Login with Facebook</div>
      <br /><br /><br /><br />
      {this.state.user_email}
      <p>EMail</p>
      <form role="form" onSubmit={this.signin.bind(this)} className="form-auth">
          <div className="form-group">
            <input type="text" defaultValue="alex@mail.com" ref="email" placeholder="EMail" required /><br />
            <input type="password" defaultValue="123456" ref="password" placeholder="Password" required />
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
