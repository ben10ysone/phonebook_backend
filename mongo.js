const mongoose = require('mongoose')

// const password = process.argv[2]

const url = 'mongodb+srv://arnavgg458:qlCQEnDeGdJ6fvES@cluster0.fknuy9s.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=cluster0'

mongoose.set('strictQuery',false)

mongoose.connect(url)

const peopleSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const People = mongoose.model('People', peopleSchema)

if (process.argv.length <3) {
  People.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

}
else{
  const people = new People({
    name: process.argv[2],
    number: process.argv[3],
  })

  people.save().then(() => {
    console.log(`added ${process.argv[2]} number ${process.argv[3]} to the database`)
    mongoose.connection.close()
  })
}

// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })