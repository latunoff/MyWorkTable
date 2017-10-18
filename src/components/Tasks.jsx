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

//var container = React.createElement('div', { id: 'main' }, '');

//var title = React.createElement('h1', { className: 'title' }, 'React');
///ReactDOM.render(title, document.getElementById('main'));

import Header from './tasks/Header';
import Item from './tasks/Item';
import items from './tasks/items';
import Form from './tasks/Form';


class Tasks extends React.Component{
    constructor(props){
        super(props);
        
        //this.props.title = 'Items';
        this.state = {
            //items: this.props.initialData,
            //title: 'Items'
            items: [],
            itemsAll: []
        };
        //console.log('constructor');
        this.filterList = this.filterList.bind(this);
    }
    
    componentDidMount(){
        axios.get('/api/items')
            .then(response => response.data)
            //.then(items => this.setState({ items }))
            .then(items => {
                this.setState({ items });
                this.itemsAll = items;
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

    handleStatusChange(id){
        axios.patch(`/api/items/${id}`)
            .then(response => {
                const items = this.state.items.map(item => {
                    if(item.id === id){
                        item = response.data;
                    }
                    return item;
                });
                this.setState({ items });
            })
            .catch(this.handleError);
    }

    handleDelete(id){
        axios.delete(`/api/items/${id}`)
            .then( () => {
                const items = this.itemsAll = this.state.items.filter(item => item.id !== id);
                this.setState({ items });
            })
            .catch(this.handleError);
    }

    
    handleAdd(title){
        axios.post('/api/items', { title })
            .then(response => response.data)
            .then(item => {
                const items = this.itemsAll = [...this.state.items, item];
                this.setState({ items });
            })
            .catch(this.handleError);
    }

    handleEdit(id, title){
        axios.put(`/api/items/${id}`, {title} )
            .then( response => {
                const items = this.state.items.map(item => {
                    if(item.id === id){
                        item = response.data;
                    }
                    return item;
                });

                this.setState({ items });
            }
            )
            .catch(this.handleError);
    }

    handleError(e){
        console.error(e);
    }

    filterList(e){
        const items = this.itemsAll.filter(function(item){
            return item.title.toLowerCase().search(e.target.value.toLowerCase())!== -1;
        });
        this.setState({ items });
    }

/*
    handleStatusChange(id){
        let items = this.state.items.map(item => {
            if(item.id === id){
                item.completed = !item.completed;
            }
            return item;
        });

        this.setState({ items });
    }

    handleDelete(id){
        let items = this.state.items.filter(item => item.id !== id);

        this.setState({ items });
    }
    
    nextId(){
        this._nextId = this._nextId || 4;
        return this._nextId++;
    }

    handleAdd(title){
        let item = {
            id: this.nextId(),
            title,
            completed: false
        }
        
        let items = [...this.state.items, item];

        this.setState({ items });
    }

    handleEdit(id, title){
        let items = this.state.items.map(item => {
            if(item.id === id){
                item.title = title;
            }
            return item;
        });

        this.setState({ items });
    }
*/
    render() {
        return (
        <main>
            <Header title={this.props.title} items={this.state.items} />
            <input placeholder="Search" onChange={this.filterList} className="search_field" />
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

            <Form onAdd={this.handleAdd.bind(this)} />
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
    title: React.PropTypes.string.isRequired,
    items: React.PropTypes.array.isRequired,
};
App.defaultProps = {
    title: 'Test App',
};
*/

export default Tasks;