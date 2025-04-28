import mongoose from "mongoose"
 
const userSchema=new mongoose.Schema({
    userName: String,
    email: String,
    password: String})

interface user extends Document{
    userName:string,
    email:string,
    password:string
}
const User = mongoose.model<user>('User', userSchema);
export default User