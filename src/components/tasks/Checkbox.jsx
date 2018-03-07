import React from 'react';
import PropTypes from 'prop-types';

/*
class Checkbox extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            checked: this.props.initiallyChecked
        };
    }
    
    handleClick(event){
        this.setState({
            checked: !this.state.checked
        },
        () => console.log(this.state.checked)
        );
    }

    render(){
        return (
            <button className="checkbox icon" onClick={this.handleClick.bind(this)}>
                <i className="material-icons">check_box{!this.state.checked ? '_outline_blank' : ''}</i>
            </button>
        );
    }
}


*/

function Checkbox(props) {
    return (
            <button className="checkbox icon" onClick={props.onChange}>
                <i className="material-icons">check_box{!props.checked ? '_outline_blank' : ''}</i>
            </button>
        );
}

Checkbox.protoTypes = {
    checked: PropTypes.bool.isRequired
};
    
export default Checkbox;