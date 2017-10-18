import React from 'react';

function Stats(props){
    let total = props.items.length;
    let completed = props.items.filter(item => item.completed).length;
    let remains = total - completed;
    return(
        <table className="stats"><tbody>
            <tr>
                <th>Total:</th>
                <td>{total}</td>
            </tr>
            <tr>
                <th>Done:</th>
                <td>{completed}</td>
            </tr>
            <tr>
                <th>Remains:</th>
                <td>{remains}</td>
            </tr>
        </tbody></table>
    );
}

export default Stats;