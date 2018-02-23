import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import './app.scss';

import { Router, Route, hashHistory, IndexRoute, IndexRedirect, browserHistory } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import Home from './components/Home';
import About from './components/About';
import Pages from './components/Pages';
import Page from './components/Page';
import Dir from './components/Dir';
import NotFound from './components/NotFound';
import Tasks from './components/Tasks';
import Auth from './components/auth/Auth';

import configureStore from './store/configureStore';

import books from './data/items';

const user_email = 'alex@...';
const store = configureStore();

const user = JSON.parse(localStorage.getItem('user'));

ReactDOM.render(
<Provider store={store}>
<Router history={browserHistory}>
    <Route path="/" component={App} user_email={user_email}>
        <IndexRoute component={Home} />
        <Route path="about" component={About} />
        <Route path="tasks" component={Tasks} />
        <Route path="pages" component={Pages}>
            <IndexRedirect to="/pages/react" />
            <Route path=":dir">
                <IndexRoute component={Dir} books={books} />
                <Route path=":page" component={Page} books={books} />
            </Route>
        </Route>
        <Route path="auth" component={Auth} />
        <Route path="*" component={NotFound} />
    </Route>
</Router>
</Provider>
, document.getElementById('root'));

/*
use <Router history={hashHistory}> to work with # in URL and support old browsers
or
use <Router history={browserHistory}> for better view but no support IE8, 9
also in pachage.json add " --history-api-fallback" to "scripts"->"start" string param of webpack

<Route path=":dir">
    <IndexRoute component={Dir} />
    <Route path=":page" component={Page} />
</Route>
instead of
<Route path=":dir" component={Dir} />
<Route path=":page" component={Page} />
is using that {Page} knows :dir param in URL

<IndexRedirect to="/pages/react" /> (&& import IndexRedirect ) - default redirect to need page

*/