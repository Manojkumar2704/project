import mongoose from "mongoose"

export const connectToDatabase=()=> {
    mongoose.connect("mongodb://localhost:27017/taskdb");
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('Connected to database');
    });
}  