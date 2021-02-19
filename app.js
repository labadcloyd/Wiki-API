const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser:true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false);

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const article = mongoose.model('article', articleSchema)

app.listen(3000, ()=>{
    console.log('listening on port 3000')
})
app.route('/articles')
    .get((req,res)=>{
        article.find((err,foundArticles)=>{
            if(err){
                res.send(err)
            }else{
                res.send(foundArticles)
            }
        })
    })
    .post((req,res)=>{
        let newArticle = new article({
            title: req.body.title,
            content:req.body.content
        })
        newArticle.save((err)=>{
            if(err){
                res.send(err)
            }else{
                res.send('Successfuly added the article')
            }
        })
    })
    .delete((req,res)=>{
        article.deleteMany((err)=>{
            if(err){
                res.send(err)
            }else{
                res.send('Successfuly deleted the articles')
            }
        })
    });