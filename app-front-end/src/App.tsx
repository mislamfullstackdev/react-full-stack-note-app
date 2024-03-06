import React, { useEffect, useState } from "react";
import "./App.css";

// Added dummy css for visualization

const App = () => {
  const [notes, setNotes] = useState([]);
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
    }
  });
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleAddNote = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(title)
    console.log(content)
  }

  return(
    <div className="app-container">
      <form className="note-form" onSubmit={handleAddNote}>
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
          <div className="note-item" key={note.id}>
            <div className="notes-header">
              <button>x</button>
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
