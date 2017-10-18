import React from 'react';

import Checkbox from './Checkbox';
import Button from './Button';

class Item extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            editing: false
        }; 
    }

    /*
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps: nextProps=');
        console.log(nextProps);
    }
    componentWillUpdate(nextProps, nextState) {
        console.log('componentWillUpdate: nextProps=' + ' nextState=');
        console.log(nextProps);
        console.log(nextState);
    }
    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate: nextProps=' + ' nextState=');
        console.log(nextProps);
        console.log(nextState);
        return true;
    }
    componentDidUpdate(prevProps, prevState){
        console.log('componentDidUpdate: prevProps=' + ' prevState=');
        console.log(prevProps);
        console.log(prevState);
    }
    componentWillUnmount(){
        console.log('componentWillUnmount');
    }
    */

    componentDidUpdate(prevProps, prevState){
        if(this.state.editing){
            this.refs.title.focus();
        }
    }

    handleSubmit(event){
        event.preventDefault();
        let title = this.refs.title.value;
        if(title){
            this.props.onEdit(this.props.id, title);
            this.setState({ editing: false });
        }
    }

    render() {
        return (
            this.state.editing 
            ?
            <form className="todo-edit-form" onSubmit={this.handleSubmit.bind(this)}>
                <input type="text" ref="title" defaultValue={this.props.title} />
                <Button type="submit" className="save icon" icon="save" />
            </form>
            :
        <div className={`todo${this.props.completed ? ' completed' : '' }`}>
            <Checkbox checked={this.props.completed} onChange={() => this.props.onStatusChange(this.props.id)} />
            <span className="todo-title">{this.props.title}</span>
            <Button className="edit icon" icon="edit" onClick={() => this.setState({ editing:true })} />
            <Button className="delete icon" icon="delete" onClick={() => this.props.onDelete(this.props.id)} />
        </div> 
        );
    }
}


/*
function Item(props){
    function handleChange(){
        props.onStatusChange(props.id);
    }
    
    return (
        <div className={`todo${props.completed ? ' completed' : '' }`}>
            <Checkbox checked={props.completed} onChange={handleChange} />
            <span className="todo-title">{props.title}</span>
            <Button className="delete icon" icon="delete" onClick={() => props.onDelete(props.id)}/>
        </div>
    );
}
*/
/*
Item.propTypes = {

}
*/
export default Item;