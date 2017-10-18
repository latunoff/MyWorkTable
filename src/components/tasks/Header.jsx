import React from 'react';

import Stats from './stats';
import StopWatch from './stopwatch';

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
/*
Header.propTypes = {
    title: React.PropTypes.string.isRequired
}
*/
export default Header;