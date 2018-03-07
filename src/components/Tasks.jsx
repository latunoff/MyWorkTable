/*
using commands:
npm install body-parser
npm install --save axios  - axios install 
node server   - run server on localhost:3000
npm install react-addons-css-transition-group --save    - ReactCSS install
*/

import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Loader from '../components/Loader';

//var container = React.createElement('div', { id: 'main' }, '');

//var title = React.createElement('h1', { className: 'title' }, 'React');
///ReactDOM.render(title, document.getElementById('main'));

import Header from './tasks/Header';
import Item from './tasks/Item';
import items from './tasks/items';
import Form from './tasks/Form';
import PropTypes from 'prop-types';

class Tasks extends React.Component{
    constructor(props){
        super(props);
        //console.log(props);
        this.state = {
            title: 'Items to do',
            user: props.route.user,
            auth: props.route.user != undefined && props.route.user.id != undefined,
            items: [],
            itemsAll: [],
            loading: true
        };
        //console.log(this.state);
        //console.log('constructor');
        this.filterList = this.filterList.bind(this);
    }

    componentWillUpdate(){
        this.state = {
          user: this.props.user,
          auth: this.props.auth
        };
    }
    
    componentDidMount() {
        //console.log(this.state);
        if (this.state.auth)
        {
            axios.get('/api/tasks/items/')
            .then(response => response.data)
            //.then(items => this.setState({ items }))
            .then(items => {
                if (Array.isArray(items)) {
                    //console.log('Items: ', items);
                    this.setState({ items, loading: false });
                    this.itemsAll = items;
                } else {
                    this.setState({ items: [], loading: false });
                    console.log(items);
                    // store.dispatch({
                    //     type: 'MESSAGE_ERROR',
                    //     message: items
                    // });
                    console.log('wer', store.getState());
                }
            })
            .catch(error => console.log('App Request error: '+error));
                //console.log(items);
            /*
            fetch('/api/items')
                .then(response => response.json)
                .then(items => this.setState({ items }))
                .catch(error => console.log('App Request error: '+error));
            console.log(items);
            */
        }
    }

    handleStatusChange(id)
    {
        axios.patch(`/api/tasks/items/${id}`)
        .then(response => {
            const items = this.state.items.map(item => {
                if(item.id === id) item = response.data;
                return item;
            });
            this.setState({ items });
        })
        .catch(this.handleError);
    }

    handleDelete(id)
    {
        axios.delete(`/api/tasks/items/${id}`)
        .then( () => {
            const items = this.itemsAll = this.state.items.filter(item => item.id !== id);
            this.setState({ items });
        })
        .catch(this.handleError);
    }
    
    handleAdd(title)
    {
        if (this.state.auth)
            axios.post('/api/tasks/items', { title })
            .then(response => response.data)
            .then(item => {
                item.key = item.id;
                const items = this.itemsAll = [...this.state.items, item];
                this.setState({ items });
            })
            .catch(this.handleError);
    }

    handleEdit(id, title)
    {
        axios.put(`/api/items/${id}`, {title} )
        .then( response => {
            //console.log(response);
            const items = this.state.items.map(item => {
                if(item.id === id) item = response.data;
                return item;
            });
            this.setState({ items });
        }
        )
        .catch(this.handleError);
    }

    handleError(e)
    {
        console.error(e);
    }

    filterList(e)
    {
        const items = this.itemsAll.filter(function(item){
            return item.title.toLowerCase().search(e.target.value.toLowerCase())!== -1;
        });
        this.setState({ items });
    }

    render() {
        let loader_class = 'loader ' + this.state.loading;
        return (
        <main>
            <Header title={this.state.title} items={this.state.items} />
            <input placeholder="Search" onChange={this.filterList} className="search_field" />
            <div className={loader_class}><Loader /></div>
            <ReactCSSTransitionGroup component="section" className="todo-list"
                transitionName="slide" transitionEnterTimeout={300} transitionLeaveTimeout={300}
                transitionAppear={true} transitionAppearTimeout={700}
                transitionEnter={true} transitionLeave={true}>
                { this.state.items.map(item => <Item 
                    key={item.id} 
                    id={item.id}
                    title={item.title} 
                    completed={item.completed} 
                    onStatusChange={this.handleStatusChange.bind(this)} 
                    onDelete={this.handleDelete.bind(this)}
                    onEdit={this.handleEdit.bind(this)}
                    />) }
            </ReactCSSTransitionGroup>

            <Form onAdd={this.handleAdd.bind(this)} todos={this.state.items} />
        </main>
        );
    }
}

/*
function App(props) {
    return ( 
    <main>
        <Header title={props.title} />

        <section className="todo-list">
            { props.items.map(item => <Item key={item.id} title={item.title} completed={item.completed} />) }
        </section>
    </main>
    );
};
*/

/*
App.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
};
App.defaultProps = {
    title: 'Test App',
};
*/

export default Tasks;