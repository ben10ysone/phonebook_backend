const express=require("express")
const app = express()
const morgan=require("morgan")
const cors=require('cors')

const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

app.use(cors())

app.use(morgan('tiny'))

app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

let persons=[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/',(request,response)=>{
    response.send('<h1>This is root page</h1>')
})

app.get('/api/persons',(request,response)=>{
    response.json(persons)
})

app.get('/info', (request, response)=>{
    const date= new Date()
    response.send( 
        `<div>
        <p> Phonebook has info for ${persons.length} people</p>
        <p> ${date}</p>
        </div>`)
})

app.get('/api/persons/:id',(request,response)=>{
    const id=request.params.id
    const person=persons.find(person => person.id===id)
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId=()=>{
    const id=Math.floor(Math.random() * (1e5))
    return String(id) 
}

app.post('/api/persons', (request, response)=>{
    const body=request.body
    if(!body.name){
        return response.status(400).json({"error": "name is missing"})
    }
    if(!body.number){
        return response.status(400).json({"error": "number is missing"})
    }
    if(persons.some(person => person.name===body.name)){
        return response.status(400).json({"error":`${body.name} already exists`})
    }
    const person={
        "name": body.name,
        "number": body.number,
        "id":generateId()
    }
    persons=persons.concat(person)
    response.json(persons)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT=3001
app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${3001}`)
})
