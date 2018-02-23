'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
var CryptoJS = require("crypto-js");

function insertDocument(doc, collection) {
    //while (1) {
        //var cursor = collection.find( {}, { _id: 1 } ).sort( { _id: -1 } ).limit(1);
        //var seq = cursor.hasNext() ? cursor.next()._id + 1 : 1;
        //doc._id = seq;
        collection.aggregate({$sort: {id: -1}}, {$limit: 1}).toArray((err, result) => {
            //console.log(result);
            if (err) return err;
            nextUserId = result.length > 0 ? result[0].id : 0;
            nextUserId++;
            doc.id = nextUserId;
            collection.insert(doc, (err, result1) => {
                if (err == undefined) {
                    console.log('Doc ', doc, ' added to ', collection.s.name);
                    return '';
                } else {
                    console.log(err);
                    return err;
                    //return res.sendStatus(500);
                }
            });
        });
        /*
        if( results.hasWriteError() ) {
            if( results.writeError.code == 11000 )   //dup key
                continue;
            else
                console.log( "unexpected error inserting data: " + tojson( results ) );
        }*/
        //break;}
}
/*
function getNextSequence(name, db) {
    console.log(db.counters);
    var ret = db.counters.findAndModify(
        {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
        }//, (res) => console.log(res)
    );
    console.log(ret);
    return ret.seq;
}*/

//console.log(CryptoJS.MD5('retuiouytre').toString());

let todos = [];//require('./api/items.json');
let users = [];//require('./api/users.json');

const app = express();

let nextId = 1;
let userId = 1;

app.set('port', (process.env.PORT || 3001));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());

//console.log('Server requested');
//const api = require('./server/api/routes');
//app.use('/api', api);


var MongoClient = require('mongodb').MongoClient;
var db;

MongoClient.connect('mongodb://localhost:27017/mywt', (err, database) => {
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
    //db.counters.insert({ _id: "tokens", seq: 0 });

    app.listen(3012, () => console.log('MongoDB API started'));
    //console.log('===', db.collection('tokens').s.name);

    //db.collection('users').find({id: {$gt: 0}}).toArray(function (err, result) { console.log("Users:\r\n"); console.log(result); });
    db.collection('tokens').find({id: {$gt: 0}}).toArray(function (err, result) { console.log("tokens:\r\n"); console.log(result); });
});

//get todos
app.get('/api/items', function (req, res) {
    console.log('api/items requested');
    db.collection('todos').find({user_id: 1}).toArray(function (err, result) {
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
        nextId = result[0].id + 1 | 1;

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

// SIGN
app.post('/api/signcheck', (req, res) => {
    req.checkBody(req.cookies.user.email, 'Wrong E-Mail!').isEmail();
    
    res.send(req.cookies.user.email);
});

app.post('/api/signin', (req, res) => {
    //console.log(req.body);
    let user = {};//users.find(user => user.email == req.body.email && user.password == req.body.password);
    req.checkBody('email', 'Wrong E-Mail!').isEmail();
    let pass_hash = CryptoJS.MD5(req.body.password).toString();

    db.collection('users')
    .find({email: req.body.email, password: pass_hash})
    .toArray(function (err, res1){
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            if(res1.length > 0)
            {
                let hash = CryptoJS.MD5("md5", res1[0].email + res1[0].password + 'salz@!#$%^&*(').toString();
                user = {
                    id:     res1[0].id,
                    email:  res1[0].email,
                    token:  hash
                }
                let token = {
                    //id: getNextSequence("tokens", db),
                    hash,
                    valid: Date.now() + 1000*60*60*24
                }
                insertDocument(token, db.collection('tokens'));
                /*
                db.collection('tokens').insert(token, (err, result) => {
                    if(err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    console.log('Token ' + token.hash + ' has created for ' + user.email + '');
                });*/
            }
            else user = {};
            //console.log(user);
            //res.cookie('user', user, {maxAge: 1000*60*60*24, httpOnly: true});
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
                    password: CryptoJS.MD5(req.body.password).toString()
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


app.get('*', (req, res) => {
    fs.readFile(`${__dirname}/build/index.html`, (error, html) => {
        if (error) throw error;

        res.setHeader('Content-Type', 'text/html');
        res.end(html);
    });
});

app.listen(app.get('port'), () => console.log(`Server is listening: http://localhost:${app.get('port')}`));



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
