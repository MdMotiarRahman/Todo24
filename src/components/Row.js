import React from 'react';

function Row({ item, deleteTask }) {
    return (
        <li>
            {item.id}: {item.description}
            <button className='delete-button' onClick={() => deleteTask(item.id)}>Delete</button>
        </li>
    );
}

export default Row;