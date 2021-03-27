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
    })
;

app.route('/articles/:articleTitle')
    .get((req,res)=>{
        let title = decodeURIComponent(req.params.articleTitle)
        article.findOne(({title:title}),(err,foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle)
            }else{
                res.send(err)
            }
        })
    })
    .put((req,res)=>{
        let title = decodeURIComponent(req.params.articleTitle);
        let reqTitle= req.body.title;
        let reqContent = req.body.content;
        article.updateOne({title:title},{title:reqTitle,content:reqContent},{overwrite:true},(err)=>{
            if(err){
                res.send(err)
            }else{
                res.send('Successfuly updated article')
            }
        })
    })
    .patch((req,res)=>{
        let title = decodeURIComponent(req.params.articleTitle);
        article.updateOne({title:title},{$set:req.body},{overwrite:true},(err)=>{
            if(err){
                res.send(err)
            }else{
                res.send('Successfuly updated article')
            }
        })
    })
    .delete((req,res)=>{
        let title = decodeURIComponent(req.params.articleTitle);
        article.deleteOne({title:title},(err)=>{
            if(err){
                res.send(err)
            }else{
                res.send('Successfuly updated article')
            }
        })
    })
;

// AXIOS REQUEST SAMPLE

// // AXIOS GLOBALS
// axios.defaults.headers.common['X-Auth-Token'] =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// // GET REQUEST
// function getTodos() {
//   // axios({
//   //   method: 'get',
//   //   url: 'https://jsonplaceholder.typicode.com/todos',
//   //   params: {
//   //     _limit: 5
//   //   }
//   // })
//   //   .then(res => showOutput(res))
//   //   .catch(err => console.error(err));

//   axios
//     .get('https://jsonplaceholder.typicode.com/todos?_limit=5', {
//       timeout: 5000
//     })
//     .then(res => showOutput(res))
//     .catch(err => console.error(err));
// }

// // POST REQUEST
// function addTodo() {
//   axios
//     .post('https://jsonplaceholder.typicode.com/todos', {
//       title: 'New Todo',
//       completed: false
//     })
//     .then(res => showOutput(res))
//     .catch(err => console.error(err));
// }

// // PUT/PATCH REQUEST
// function updateTodo() {
//   axios
//     .patch('https://jsonplaceholder.typicode.com/todos/1', {
//       title: 'Updated Todo',
//       completed: true
//     })
//     .then(res => showOutput(res))
//     .catch(err => console.error(err));
// }

// // DELETE REQUEST
// function removeTodo() {
//   axios
//     .delete('https://jsonplaceholder.typicode.com/todos/1')
//     .then(res => showOutput(res))
//     .catch(err => console.error(err));
// }

// // SIMULTANEOUS DATA
// function getData() {
//   axios
//     .all([
//       axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
//       axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
//     ])
//     .then(axios.spread((todos, posts) => showOutput(posts)))
//     .catch(err => console.error(err));
// }

// // CUSTOM HEADERS
// function customHeaders() {
//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: 'sometoken'
//     }
//   };

//   axios
//     .post(
//       'https://jsonplaceholder.typicode.com/todos',
//       {
//         title: 'New Todo',
//         completed: false
//       },
//       config
//     )
//     .then(res => showOutput(res))
//     .catch(err => console.error(err));
// }

// // TRANSFORMING REQUESTS & RESPONSES
// function transformResponse() {
//   const options = {
//     method: 'post',
//     url: 'https://jsonplaceholder.typicode.com/todos',
//     data: {
//       title: 'Hello World'
//     },
//     transformResponse: axios.defaults.transformResponse.concat(data => {
//       data.title = data.title.toUpperCase();
//       return data;
//     })
//   };

//   axios(options).then(res => showOutput(res));
// }

// // ERROR HANDLING
// function errorHandling() {
//   axios
//     .get('https://jsonplaceholder.typicode.com/todoss', {
//       // validateStatus: function(status) {
//       //   return status < 500; // Reject only if status is greater or equal to 500
//       // }
//     })
//     .then(res => showOutput(res))
//     .catch(err => {
//       if (err.response) {
//         // Server responded with a status other than 200 range
//         console.log(err.response.data);
//         console.log(err.response.status);
//         console.log(err.response.headers);

//         if (err.response.status === 404) {
//           alert('Error: Page Not Found');
//         }
//       } else if (err.request) {
//         // Request was made but no response
//         console.error(err.request);
//       } else {
//         console.error(err.message);
//       }
//     });
// }

// // CANCEL TOKEN
// function cancelToken() {
//   const source = axios.CancelToken.source();

//   axios
//     .get('https://jsonplaceholder.typicode.com/todos', {
//       cancelToken: source.token
//     })
//     .then(res => showOutput(res))
//     .catch(thrown => {
//       if (axios.isCancel(thrown)) {
//         console.log('Request canceled', thrown.message);
//       }
//     });

//   if (true) {
//     source.cancel('Request canceled!');
//   }
// }

// // INTERCEPTING REQUESTS & RESPONSES
// axios.interceptors.request.use(
//   config => {
//     console.log(
//       `${config.method.toUpperCase()} request sent to ${
//         config.url
//       } at ${new Date().getTime()}`
//     );

//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// // AXIOS INSTANCE
// const axiosInstance = axios.create({
//   // Other custom settings
//   baseURL: 'https://jsonplaceholder.typicode.com'
// });