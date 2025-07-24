require('dotenv').config()
const express=require("express")
const app = express()
const morgan=require("morgan")
const People=require('./models/people')

const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

app.use(express.static('dist'))
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

let persons=[]

app.get('/',(request,response)=>{
    response.send('<h1>This is root page</h1>')
})

app.get('/api/persons',(request,response)=>{
  People.find({}).then(persons=>{
    response.json(persons)
  })  
})

app.get('/info', (request, response)=>{
  People.find({}).then(persons=>{
    const date= new Date()
    response.send( 
        `<div>
        <p> Phonebook has info for ${persons.length} people</p>
        <p> ${date}</p>
        </div>`)
  })
})

app.get('/api/persons/:id',(request,response)=>{
    People.findById(request.params.id).then(person=>{
      response.json(person)
    })
    .catch(error=>{
      response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response)=>{
    const body=request.body
    if(!body.name){
        return response.status(400).json({"error": "name is missing"})
    }
    if(!body.number){
        return response.status(400).json({"error": "number is missing"})
    }
    const person=new People({
      "name": body.name,
      "number": body.number,
    })
    console.log(person)
    // if(persons.some(person => person.name===body.name)){
    //     return response.status(400).json({"error":`${body.name} already exists`})
    // }
    person.save().then(savedPerson=>{
      response.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT=3001
app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${3001}`)
})
