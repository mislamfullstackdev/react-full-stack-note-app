import React, { useEffect, useState } from "react";
import "./App.css";
import { Note } from "./note"

// Added dummy css for visualization

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
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

  

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

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
        
          <div className="note-item" key="">
            <div className="notes-header">
              <button>x</button>
            </div>
            <h2>note.title</h2>
            <p>note.content</p>
          </div>
       
      </div>
    </div>
  );
}

export default App;
