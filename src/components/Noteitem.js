import React from 'react'
import Notes from './Notes';

const Noteitem = (props) => {
    const { note } = props;
    return (
        <div className='col-md-3'>

            <div className="card" >
                <div className="card-body">
                    <h5 className="card-title">{note.title}</h5>
                    <p className="card-text">{note.description}</p>
                </div>
            </div>

        </div>
    )
}

export default Noteitem