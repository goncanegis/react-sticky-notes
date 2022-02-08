import React, { useState, useReducer } from 'react';
import { v4 as uuid } from 'uuid';

const initialNotesState = {
  lastNoteCreated: null,
  totalNotes: 0,
  notes: [],
};

const notesReducer = (prevState, action) => {
  switch (action.type) {
    case 'ADD_NOTE': {
      const newState = {
        lastNoteCreated: new Date().toTimeString().slice(0, 8),
        totalNotes: prevState.notes.length + 1,
        notes: [...prevState.notes, action.payload],
      };
      console.log('After ADD_NOTE: ', newState);
      return newState;
    }
    case 'DELETE_NOTE': {
      const newState = {
        ...prevState,
        totalNotes: prevState.notes.length - 1,
        notes: prevState.notes.filter((note) => note.id !== action.payload.id),
      };
      console.log('After DELETE_NOTE: ', newState);
      return newState;
    }
  }
};

export function App() {
  const [noteInput, setNoteInput] = useState('');
  const [notesState, dispatch] = useReducer(notesReducer, initialNotesState);

  const addNote = (event) => {
    event.preventDefault();

    if (!noteInput) {
      return;
    }

    const newNote = {
      id: uuid(),
      text: noteInput,
      rotate: Math.floor(Math.random() * 20),
    };

    dispatch({ type: 'ADD_NOTE', payload: newNote });
    setNoteInput('');
  };

  const dropNote = (e) => {
    e.target.style.left = `${e.pageX - 50}px`;
    e.target.style.top = `${e.pageY - 50}px`;
  };

  const dragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div className="app" onDragOver={dragOver}>
      <h1>
        Sticky Notes ({notesState.totalNotes}){' '}
        <span>
          {notesState.totalNotes > 0
            ? `Last note created: ${notesState.lastNoteCreated}`
            : ''}
        </span>
      </h1>
      <form className="note-form" onSubmit={addNote}>
        <textarea
          placeholder="Create a new note..."
          value={noteInput}
          onChange={(event) => setNoteInput(event.target.value)}
        />
        <button>Add</button>
      </form>

      {notesState.notes.map((note) => (
        <div
          className="note"
          style={{ transform: `rotate(${note.rotate}deg)` }}
          draggable="true"
          onDragEnd={dropNote}
          key={note.id}
        >
          <div
            className="close"
            onClick={() => dispatch({ type: 'DELETE_NOTE', payload: note })}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="tomato"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>

          <pre className="text">{note.text}</pre>
        </div>
      ))}
    </div>
  );
}
