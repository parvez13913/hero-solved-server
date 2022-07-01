const express = require("express");
const app = express();
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yabnr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const todoCollection = client.db('HeroSolved').collection('todo');
        const completedTodoCollection = client.db('HeroSolved').collection('completedTodo');

        app.post('/todo', async (req, res) => {
            const todo = req.body;
            const result = await todoCollection.insertOne(todo);
            res.send(result);
        });

        app.get('/todo', async (req, res) => {
            const quary = {};
            const cursor = todoCollection.find(quary);
            const todo = await cursor.toArray();
            res.send(todo);
        });

        app.delete('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const todo = await todoCollection.deleteOne(query);
            res.send(todo);
        });

        // completed ToDo
        app.post('/completedTodo', async (req, res) => {
            const todo = req.body;
            const result = await completedTodoCollection.insertOne(todo);
            res.send(result);
        });

        app.get('/completedTodo', async (req, res) => {
            const quary = {};
            const cursor = completedTodoCollection.find(quary);
            const completedTodo = await cursor.toArray();
            res.send(completedTodo);
        });



        app.get('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const todo = await todoCollection.findOne(query);
            res.send(todo);
        })


        app.put('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const todo = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: todo,
            };
            const result = await todoCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
    }
    finally {

    }
}

run()

app.get('/', async (req, res) => {
    res.send("HelloW Hero");
});

app.listen(port, () => {
    console.log(`Hero Listening On ${port}`);
})