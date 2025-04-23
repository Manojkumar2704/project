import express, { Request, Response } from 'express';
const mongoose=require("mongoose")
const  User =require('./model/userModel') ; 
const Products=require("./model/productModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const app = express();
const port = 7000;
const secretKey="manoj"

app.use(express.json());

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

app.post("/register",async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
       res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      user: {
        userName: savedUser.userName,
        email: savedUser.email,
      },
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
});


app.post("/login", async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  const user =await User.findOne({userName});
  if (user) {
    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (ispasswordValid) {
      const token = await jwt.sign({ userName }, secretKey, {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      console.log("invalid password for the user", userName);
      res.status(400).json({ message: "Invalid credentials" });
    }
  } else {
    console.log("user not found : ", userName);
    res.status(401).json({ message: "Invalid credentials" });
  }
});


app.post("/upload", async (req: Request, res: Response) => {
    const {name,description,price,quantity,image}=req.body;
    const newProduct=await new Products({
        name,
        description,
        price,
        quantity,
        image,
    })
    try {
    const result=await newProduct.save();
    res.status(200).send(result)
    } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error when adding product", error });
  }
})



app.listen(port,()=>console.log("connected to port http://localhost:"+port)
)