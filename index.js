const express = require('express')// Comand JS
// import http from 'http' EMS Modules
const cors = require('cors')
const app = express()
const logger = require('./loggerMidelware')

app.use(cors())
app.use(express.json())

// Esto es un midelware
app.use(logger)

// Cors: Compartir recursos entre diferentes origenes

let notes = [
  {
    id: 1,
    content: 'Soy el mejor',
    date: '',
    important: true
  },
  {
    id: 2,
    content: 'Esta es la segunda nota',
    date: '',
    important: true
  },
  {
    id: 3,
    content: 'hoy comi en pizarra jeje',
    date: '',
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    date: new Date(),
    important: typeof note.important !== 'undefined' ? note.important : false
  }

  notes = [...notes, newNote]
  response.status(201).json(newNote)
})

// Problema de rutas 404
app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
