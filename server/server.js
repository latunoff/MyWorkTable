'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
var CryptoJS = require("crypto-js");
var dateFormat = require('dateformat');
//var timeout = require('connect-timeout');

const AUTH_TIME =  1000*60*60*24; //dateFormat(Date.now() + 1000*60*60*24, "dd.mm.yyyy, hh:MM:ss")

function insertDocument(doc, collection, callback) {
    //while (1) {
        //var cursor = collection.find( {}, { _id: 1 } ).sort( { _id: -1 } ).limit(1);
        //var seq = cursor.hasNext() ? cursor.next()._id + 1 : 1;
        //doc._id = seq;
        collection.aggregate({$sort: {id: -1}}, {$limit: 1}).toArray((err, result) => {
            //console.log(result);
            if (err) return err;
            nextId = result.length > 0 ? result[0].id : 0;
            nextId++;
            doc.id = nextId;
            collection.insert(doc, (err, result1) => {
                if (err == undefined) {
                    console.log('Doc ', doc, ' added to ', collection.s.name);
                    callback(doc);
                } else {
                    console.log(err);
                    callback(err);
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
let userId = undefined;

app.set('port', (process.env.PORT || 3000));

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

    //db.collection('tokens').remove();
    db.collection('users').find({id: {$gt: 0}}).toArray(function (err, result) { console.log("Users:\r\n"); console.log(result); });
    db.collection('tokens').find({id: {$gt: 0}}).toArray(function (err, result) { console.log("tokens:\n", result); });
});

//app.get(/^\/api\/([0-9a-z]{32})\/(.*)$/, (req, res) => { console.log(req); });
//app.get('*/:token', (req, res) => { console.log(req.params); });
/*
function checkToken(req) {
    const token = req.cookies.userToken;
    console.log('checkToken ' + token + ' ...');
    return db.collection('tokens').find({hash: token, valid: {$gt: Date.now()}}).toArray((err, result) => { 
        console.log('Token user# ' + result[0].userId);
        if (result.length > 0) return result[0].userId;
        else return 0;
    });
}
*/
/*
function myMiddleware (req, res, next) {
    if (req.method === 'GET') { 
        // Do some code
    }
    // keep executing the router middleware
    next()
}
app.use(myMiddleware)
*/

app.all(/^\/api\/(.*)$/, (req, res, next) =>
{
    console.log('Requested: ' + req.url, req.params);
    if (req.params[0] != 'signin' && req.params[0] != 'signup')
    {
        const token = req.cookies.userToken;
        console.log('checkToken ' + token + ' ...');
        db.collection('tokens').find({hash: token, valid: {$gt: Date.now()}}).toArray((err, result) => {
            if (result.length > 0) {
                console.log('Token user# ' + result[0].userId);
                userId = result[0].userId;
                next();
            } else {
                // sign out
                console.log("token wrong");
                res.send("token wrong");
            }
        });
    }
    else next();
});

//get todos
app.get('/api/tasks/items', function (req, res) {
    if (userId != undefined)
    {
        console.log('user#: ' + userId);
        db.collection('todos').find({user_id: userId}).toArray(function (err, result) {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }
    
            todos = result;
    
            //res.send(result);
            res.setTimeout(1000, () => res.send(result));
        });
    }
});

// add new todo
app.post('/api/tasks/items', (req, res) => {
    console.log('Todo adding ', req.body);
    const todo = {
        user_id: userId,
        title: req.body.title,
        completed: false
    };
    insertDocument(todo, db.collection('todos'), (newtodo) => {
        todo.id = newtodo.id;
        console.log('Todo added:', todo);
        todos.push(todo);
        res.send(todo);
    });
});

// save todo
app.put('/api/tasks/items/:id', (req, res) => {
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
app.patch('/api/tasks/items/:id', (req, res) => {
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

app.delete('/api/tasks/items/:id', (req, res) => {
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
    console.log('Check user: ', req.body);
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
            console.log('User found', res1);
            if(res1.length > 0)
            {
                let hash = CryptoJS.MD5(res1[0].email + res1[0].password + Math.random().toString() + 'salz@!#$%^&*(').toString();
                user = {
                    id:     res1[0].id,
                    email:  res1[0].email,
                    token:  hash
                }
                let token = {
                    userId: user.id,
                    hash,
                    valid: Date.now() + AUTH_TIME
                }
                insertDocument(token, db.collection('tokens'), () => res.send(user));
            }
            else {
                user = {};
                res.send(user);
            }
            //res.cookie('user', user, {maxAge: 1000*60*60*24, httpOnly: true});
        }
    });
});

app.post('/api/signout', (req, res) => {
    //const token = req.body.token;
    const token = req.cookies.userToken;
    console.log('Signed out: ' + token);
    db.collection('tokens').remove({ hash: token });
    res.send({});
});

app.post('/api/signup', (req, res) => {
    console.log('signup', req.body);
    db.collection('users').find({email: req.body.email}).toArray(function (err, res1) {
        if (res1.length == 0) {
            let user = {
                email: req.body.email,
                password: CryptoJS.MD5(req.body.password).toString()
            };
            insertDocument(user, db.collection('users'), (newuser) => {

                console.log('User registered:\n', user);

                const hash = CryptoJS.MD5(user.email + user.password + Math.random().toString() + 'salz@!#$%^&*(').toString();

                const token = {
                    userId: newuser.id,
                    hash,
                    valid: Date.now() + AUTH_TIME
                }
                insertDocument(token, db.collection('tokens'), () => {});
                console.log('token added:\n', token);

                user.id = newuser.id;
                user.token = hash;
                //users.push(user);
                res.send(user);
            });
        }
        else res.send('User_exists');
    });
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
