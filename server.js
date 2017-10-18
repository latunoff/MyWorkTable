'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

let todos = [];//require('./api/items.json');
let users = [];//require('./api/users.json');

const app = express();

let nextId = 1;
let userId = 1;

app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//console.log('Server requested');

var MongoClient = require('mongodb').MongoClient;
var db;

MongoClient.connect('mongodb://localhost:27017/mywt', function (err, database) {
    if (err) {
        return console.log(err);
    }
    db = database;
    /*
    var init_todos = [
        {id: 1, user_id: 1, title: 'Learn React', completed: true},
        {id: 2, user_id: 1, title: 'Learn Redux', completed: true},
        {id: 3, user_id: 1, title: 'Learn Express', completed: true},
        {id: 4, user_id: 1, title: 'Learn MongoDB', completed: true},
    ]
    db.collection('todos').insert(init_todos, function (err, result) {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        console.log('Test data inserted');
    });
    */
    app.listen(3012,function () {
        console.log('MongoDB API started');
    });
});

//get todos
app.get('/api/items', function (req, res) {
    console.log('api/items requested');
    db.collection('todos').find().toArray(function (err, result) {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }

        todos = result;

        res.send(result);
    });
});

// add new todo
app.post('/api/items', (req, res) => {
    //db.collection('todos').find().toArray(function (err, result) {
    db.collection('todos').aggregate({$sort: {id: -1}}, {$limit: 1}).toArray(function (err, result) {
        //console.log(result);
        nextId = result[0].id + 1;

        const todo = {
            id: nextId || 1,
            user_id: 1,
            title: req.body.title,
            completed: false
        };
        console.log(todo);
    
        db.collection('todos').insert(todo, function (err, result) {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
            console.log('New todo ' + todo.title + ' inserted');
        });

        todos.push(todo);
    
        res.send(todo);
    });
});

// save todo
app.put('/api/items/:id', (req, res) => {
    const todo = todos.find(todo => todo.id == req.params.id);

    if (!todo) return res.sendStatus(404);

    todo.title = req.body.title || todo.title;
    console.log(todo);

    //db.collection('todos').update({'id': req.params.id}, {$set: {'title': req.body.title}}, function (err, result) {
    db.collection('todos').save(todo, function (err, result) {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        console.log('Todo #' + todo.id + ' edited');
    });

    res.json(todo);
});

// toggle
app.patch('/api/items/:id', (req, res) => {
    const todo = todos.find(todo => todo.id == req.params.id);

    if (!todo) return res.sendStatus(404);

    todo.completed = !todo.completed;

    db.collection('todos').save(todo, function (err, result) {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        console.log('Todo ' + todo.title + ' completion: ' + todo.completed);
    });

    res.json(todo);
});

app.delete('/api/items/:id', (req, res) => {
    const index = todos.findIndex(todo => todo.id == req.params.id);
    
    if (index === -1) return res.sendStatus(404);

    db.collection('todos').remove({id: parseInt(req.params.id)}, function (err, result) {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        console.log('Todo #' + req.params.id + ' deleted');
    });

    todos.splice(index, 1);

    res.sendStatus(204);
});


app.post('/api/signin', (req, res) => {
    //console.log(req.body);
    let user = {};//users.find(user => user.email == req.body.email && user.password == req.body.password);
    db.collection('users').find({email: req.body.email, password: req.body.password}).toArray(function (err, res1){
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        else{
            if(res1.length > 0){
                user = res1[0];
            }
            else user = {};
            //console.log(user);
            res.send(user);
        }
    });
});

var nextUserId;
app.post('/api/signup', (req, res) => {
    //console.log(req.body);
    let user = {};//users.find(user => user.email == req.body.email);
    db.collection('users').find({email: req.body.email}).toArray(function (err, res1) {
        if(res1.length == 0){
            db.collection('users').aggregate({$sort: {id: -1}}, {$limit: 1}).toArray(function (err, result) {
                //console.log(result);
                nextUserId = result.length > 0 ? result[0].id : 0;
                nextUserId++;
    
                user = {
                    id: nextUserId,
                    email: req.body.email,
                    password: req.body.password
                };

                users.push(user);
                //console.log(user);
                
                db.collection('users').insert(user, function (err, result) {
                    if(err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    console.log('User ' + user.email + ' registered');
                });
                res.send(user);
            });
        }
        else res.send({});
    });
    //console.log(users);
});


/*
app.get('/api/items', (req, res) => {
    //console.log(todos);
    res.send(todos);
});

app.post('/api/signin', (req, res) => {
    //console.log(req.body);
    let user = users.find(user => user.email == req.body.email && user.password == req.body.password);
    if(user === undefined)user = {};
    console.log(user);
    res.send(user);
});

app.post('/api/signup', (req, res) => {
    //console.log(req.body);
    let user = users.find(user => user.email == req.body.email);
    if(!user){
        user = {
            id: nextUserId++,
            email: req.body.email,
            password: req.body.password
        };
        users.push(user);
    }
    else user = {};

    console.log(users);
    res.send(user);
});

app.post('/api/items', (req, res) => {
    const todo = {
        id: nextId++,
        title: req.body.title,
        completed: false
    };

    todos.push(todo);

    res.send(todo);
});

app.put('/api/items/:id', (req, res) => {
    const todo = todos.find(todo => todo.id == req.params.id);

    if (!todo) return res.sendStatus(404);

    todo.title = req.body.title || todo.title;

    res.json(todo);
});

app.patch('/api/items/:id', (req, res) => {
    const todo = todos.find(todo => todo.id == req.params.id);

    if (!todo) return res.sendStatus(404);

    todo.completed = !todo.completed;

    res.json(todo);
});

app.delete('/api/items/:id', (req, res) => {
    const index = todos.findIndex(todo => todo.id == req.params.id);
    
    if (index === -1) return res.sendStatus(404);

    todos.splice(index, 1);

    res.sendStatus(204);
});
*/

app.get('*', (req, res) => {
    fs.readFile(`${__dirname}/public/index.html`, (error, html) => {
        if (error) throw error;

        res.setHeader('Content-Type', 'text/html');
        res.end(html);
    });
});

app.listen(app.get('port'), () => console.log(`Server is listening: http://localhost:${app.get('port')}`));