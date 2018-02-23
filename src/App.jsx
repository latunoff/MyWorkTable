import React from 'react';
import { connect } from 'react-redux';

import {Link, IndexLink} from 'react-router';
import NavLink from './components/NavLink';
import Head from './components/Head';
import cookie from 'react-cookies';

class App extends React.Component {
    
    constructor(props){
        super(props);
        //alert(this.props.user_email);
        this.state = {
            user_email: props.user_email,
            //auth: false
        };
    }

    componentWillMount() {
        console.log('cookie.load');
        console.log(cookie.load('user'));
      }
/*
    getInitialState(){      
        return {

        }
    }
*/
    handleAuth(user){
        //console.log(this.props);
        //alert(user);
    }

    render() {
        
        return (
            <div className="mdl-layout mdl-layout--no-drawer-button mdl-layout--fixed-header">
                <header className="mdl-layout__header">
                    <div className="mdl-layout__header-row">
                        <span className="mdl-layout-title">My WorkTable</span>
                        <span className="mdl-layout-spacer">
                            
                            {this.props.user_email}
                            {this.state.user_email}
                        </span>
                        <nav className="mdl-navigation">
                            <NavLink to="/" className="mdl-navigation__link" onlyActiveOnIndex={true}>Home</NavLink>
                            <NavLink to="/tasks" className="mdl-navigation__link">Tasks</NavLink>
                            <NavLink to="/about" className="mdl-navigation__link">About</NavLink>
                            <NavLink to="/pages" className="mdl-navigation__link">Pages</NavLink>
                            { this.props.user == '' ? <NavLink to="/auth" className="mdl-navigation__link">Sign in</NavLink> :
                                <NavLink to="/out" className="mdl-navigation__link">Sign out</NavLink> }
                            <b>{ this.props.user }</b>
                        </nav>
                    </div>
                </header>

                <main className="mdl-layout__content">
                    {this.props.children}
                </main>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        user: state.user,
        page: state.page
    }
}

export default connect(mapStateToProps)(App);