import express, { Request, Response } from 'express';
const mongoose = require('mongoose');
const app = express();
const port = 7000;

function connectToDatabase() {
    mongoose.connect("mongodb://localhost:27017/taskdb");
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('Connected to database');
    });
}   

connectToDatabase();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});