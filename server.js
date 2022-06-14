const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const uri = 'mongodb+srv://dbUser:dbUser@cluster0.pokim.mongodb.net/?retryWrites=true&w=majority'


app.use(express.urlencoded({extended:true}))

app.set('view engine', 'ejs')
app.use(express.static('views'))

MongoClient.connect(uri,(err,client) => {
    if (err) return console.log(err)
    db = client.db('teste-bd')

    app.listen(3000, () => {
        console.log('o nosso servidor está rodando na porta 3000')
    })
})


app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/show', (req, res) => {
    db.collection('crud').insertOne(req.body, (err, result) =>{
         if(err) return console.log(err)
         console.log("Salvo no Banco de dados")
         res.redirect('/')
         db.collection('crud').find().toArray((err, results) => {
             console.log(results)
         })
    })
})

app.get('/', (req, res) => {
    let cursor = db.collection('crud').find()
})

app.get('/show', (req, res) => {
    db.collection('crud').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', {crud: results})
    })
})

app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('crud').find(ObjectId(id)).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit.ejs', {crud: result})
    })
})
.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname

    db.collection('crud').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if(err) return res.send(err)
        res.redirect('/show')
        console.log('Banco de dados atualizado')


    })
})

app.route ('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('crud').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if(err) return res.send(500, err)
        console.log('Deletando do nosso banco de dados!')
        res.redirect('/show')
    })
})