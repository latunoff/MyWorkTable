import React from 'react';
import PropTypes from 'prop-types';

class Button extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        return (
            <button className={this.props.className} onClick={this.props.onClick} {...this.props}>
                {   this.props.icon ?
                    <i className="material-icons">{this.props.icon}</i> :
                    this.props.children
                }
            </button>
        );
    }
}

Button.propTypes = {
    icon: PropTypes.string,
    className: PropTypes.string,
}

export default Button;