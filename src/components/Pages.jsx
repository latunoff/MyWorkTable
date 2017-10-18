import React from 'react';
//import {Link, IndexLink} from 'react-router';
import NavLink from './NavLink';

function Pages(props) {
    //console.log(props.params);
    return (
        <section className="content books">
            <div className="mdl-tabs">
                <div className="mdl-tabs__tab-bar">
                    <NavLink to="/pages/javascript" className="mdl-tabs__tab">JavaScript</NavLink>
                    <NavLink to="/pages/react" className="mdl-tabs__tab">React</NavLink>
                    <NavLink to="/pages/angular" className="mdl-tabs__tab">Angular</NavLink>
                </div>
                <div className="mdl-tabs__panel">
                    {props.children}
                </div>
            </div>
        </section>
    );
}

export default Pages;