import React, { useEffect, useState } from "react";
import "./App.css";
import { Note } from "./note"

// Added dummy css for visualization

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedNote, setSelectedNote] = useState< Note | null>(null);

  // Get api
  useEffect(()=>{
    const fetchNotes = async () => {
      try{
        const response = await fetch(
          "http://localhost:5000/api/notes"
        );
        const notes = await response.json();
        setNotes(notes);
      }catch(e){
        console.log(e);
      }
    };
    fetchNotes();
  }, []);

  // handle cancel
  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null)
  }
  
  // save notes, POST API
  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();
    try{
      const response = await fetch(
        "http://localhost:5000/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    }catch(e){
      console.log(e);
    }
  };

  const handleUpdateNote = (event: React.FormEvent) => {
    event.preventDefault();
    if(!selectedNote){
      return;
    }
    const updatedNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content,
    };

    const updateNotesList = notes.map((note) => (note.id === selectedNote.id ? updatedNote : note));

    setNotes(updateNotesList);
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  // Delete note
  const deleteNote = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();

    try{
      await fetch(
        `http://localhost:5000/api/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );
      const updateNotes = notes.filter(
        (note) => note.id !== noteId
      );
      setNotes(updateNotes);
    }catch(e){
      console.log(e)
    }
  }

  // track the selected note
  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  return(
    <div className="app-container">
      <form className="note-form" onSubmit={(event) => (selectedNote ? handleUpdateNote(event): handleAddNote(event))}>
        <input 
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Note Title" required>
        </input>
        <textarea 
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Content" rows={10} required>
        </textarea>
        <button type="submit">Add Note</button>
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note.id} className="note-item" onClick={() => handleNoteClick(note)}>
            <div className="notes-header">
              <button onClick={(event) => deleteNote(event, note.id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
       ))}
      </div>
    </div>
  );
}

export default App;
