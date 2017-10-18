import React from 'react';
import {Link} from 'react-router';

function NavLink(props){
    return <Link activeClassName="is-active" {...props} />
}

export default NavLink;