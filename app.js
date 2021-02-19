const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27107/wikiDB', {useNewUrlParser:true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});
const article = mongoose.model('article', articleSchema)

app.listen(3000, ()=>{
    console.log('listening on port 3000')
})
app.get('/', (req,res)=>{
    console.log('requesting access')
})

app.route('/')
.get((req,res)=>{
    article.find((err, foundArticle)=>{
        if(!err){
            res.send(foundArticle)
        }else{
            res.send(err)
        }
    })
})
.post((req,res)=>{
    let newArticle = new article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save();

})
.delete((req,res)=>{
    article.deleteMany((err)=>{
        if(!err){
            res.send('Successfuly deleted articles')
        }else{
            res.send(err)
        }
    })
});