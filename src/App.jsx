import React from 'react';
import { connect } from 'react-redux';

import {Link, IndexLink} from 'react-router';
import NavLink from './components/NavLink';
import Head from './components/Head';
import cookie from 'react-cookies';
import Auth from './components/auth/Auth';

class App extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            user: props.route.user,
            auth: props.route.user.id != undefined
        };
        //console.log(this.state);
    }

    componentWillMount() {
        //console.log('cookie.load');
        //console.log(cookie.load('user'));
      }
/*
    getInitialState(){      
        return {

        }
    }
*/
    handleAuth(user) {
        let state = {
            user: user,
            auth: user.id != undefined
        };
        //console.log(state);
        this.setState(state);
    }

    render() {
        const headerrow_class = 'mdl-layout__header-row ' + this.state.auth;
        const content_class = 'mdl-layout__content ' + this.state.auth;
        return (
            <div className="mdl-layout mdl-layout--no-drawer-button mdl-layout--fixed-header">
                <header className="mdl-layout__header">
                    <div className={headerrow_class}>
                        <span className="mdl-layout-title">My WorkTable</span>
                        <span className="mdl-layout-spacer">
                            User: {this.state.user.email}
                        </span>
                        <nav className="mdl-navigation">
                            <NavLink to="/" className="mdl-navigation__link" onlyActiveOnIndex={true}>Home</NavLink>
                            <NavLink to="/tasks" className="mdl-navigation__link">Tasks</NavLink>
                            <NavLink to="/about" className="mdl-navigation__link">About</NavLink>
                            <NavLink to="/pages" className="mdl-navigation__link">Pages</NavLink>
                            { !this.state.user.id ? <NavLink to="/auth/" className="mdl-navigation__link">Sign in</NavLink> :
                                <Auth {...this.state} isLink="true" onAuth={this.handleAuth.bind(this)} />
                            }
                            <b>{ this.props.user.email }</b>
                        </nav>
                    </div>
                </header>
                <Auth {...this.state} onAuth={this.handleAuth.bind(this)} />
                <main className={content_class}>
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

/*
const mapStateToProps = (state) => {
    return state.play;
};

const mapDispatchToProps = (dispatch) => {
    return {
        togglePlay: () => {
            dispatch(togglePlay());
        }
    }
};

const ButtonPlayComponentContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
*/