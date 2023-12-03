import { useState, useEffect } from 'react'
import noteService from './services/notes'
import './index.css'
import Note from './components/Note'
import Footer from './components/Footer'
import Notification from './components/Notification'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }


  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
      .update(id, changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const removeNote = (id) => {
    if (window.confirm(`Delete note?`)) {
      noteService
      .remove(id)
      .then(() => {
        setNotes(notes.filter((note) => note.id !== id));
      })  
    }  
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)
  
  return (
    <div>
      <h1 className='title'>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <span>&nbsp;&nbsp;</span>
        <span>&nbsp;&nbsp;</span>
        <button onClick={() => setShowAll(!showAll)} className='btn'>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>

      <ul>
        {notesToShow.map(note =>
          <>
          <Note 
          key={note.id}
          note={note} 
          toggleImportance={() => toggleImportanceOf(note.id)}  
          />
          <button onClick={() => removeNote(note.id)} className='deleteBtn'>delete</button>
          </>          
        )}
      </ul>

      <span>&nbsp;&nbsp;</span>
      <form onSubmit={addNote} className='form'>
          a new note:
        <input value={newNote} onChange={handleNoteChange}/>
        <button className='btn' type="submit">save</button>
      </form>
      <Footer />   
    </div>
  )
}

export default App;
