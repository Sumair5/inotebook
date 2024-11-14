import React, { useContext } from 'react';
import noteContext from "../context/notes/noteContext";
import Noteitem from './Noteitem';
export default function Notes() {

    const context = useContext(noteContext);
    const { notes, setnotes } = context;
    return (
        <div className="row my-3">
            <h1>You a note</h1>
            {notes.map((note) => <Noteitem note={note} />)}
        </div>
    )
}
