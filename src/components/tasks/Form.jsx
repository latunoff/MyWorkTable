import React from 'react';

import Button from './Button';
import PropTypes from 'prop-types';

import { TASK } from '../../constants/tasks';

class Form extends React.Component{
    constructor(props){
        super(props);
        //console.log(props);
        this.state = {
            title: ''
        }; 
    }

    handleSubmit(event)
    {   
        event.preventDefault();
        let title = this.state.title;
        if (title && title.length >= TASK.NAME_MIN 
                                && title.length <= TASK.NAME_MAX
                                && this.props.todos.every(item => item.title != title)) {
            this.props.onAdd(title);
            this.setState({ title: '' });
        }
    }

    handleChange(event)
    {
        let title = event.target.value;
        this.state.validClass = title.length >= TASK.NAME_MIN 
                                && title.length <= TASK.NAME_MAX
                                && this.props.todos.every(item => item.title != title);
        this.state.validClass ? this.state.disabled = "disabled" : this.state.disabled = '';
        this.setState({title});
    }

    render() {
            return(
                <form className="todo-form" onSubmit={this.handleSubmit.bind(this)}>
                    <input type="text" ref="title" 
                           value={this.state.title} 
                           placeholder="New Task name" 
                           onChange={this.handleChange.bind(this)} 
                           className={"valid_" + this.state.validClass} />
                    <Button type="submit" 
                            className={"todo_add enabled_" + this.state.validClass}
                            ref="submit_button"
                            title="Or press Enter">Add</Button>
                </form>
            );
        }
}

Form.propTypes = {
    onAdd: PropTypes.func.isRequired
}

export default Form;