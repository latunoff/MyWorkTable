import React from 'react';

import Stats from './stats';
import StopWatch from './stopwatch';

import PropTypes from 'prop-types';

function Header(props){
    //console.log(props);
    return (
        <header>
            <Stats items={props.items}/>
            <h1>{props.title}</h1>
            <StopWatch />
        </header>
    );
}

Header.propTypes = {
    title: PropTypes.string.isRequired
}

export default Header;