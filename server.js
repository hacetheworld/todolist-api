require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const jwt=require("jsonwebtoken")
const verifyToken = require("./middleware")
require('./db')
const userModal = require("./modals/UserModal")

const cors = require('cors')

const app = express();
const port = 3000;
let corsOptions = {
  origin: 'https://uuvec4.csb.app/',
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],

  // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

// To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: true }));
// To parse json data
app.use(bodyParser.json());

app.get('/', (req, res) =>{
    // console.log(process.env.url);
    res.send("Hello world")
});

// const users=[]

app.post("/v1/signup", async (req,res)=>{
    const {name,email,password}=req.body
    console.log(name,email,password,"sdfsd");
    const user = await userModal.findOne({email})

    if (user){
        return res.status(200).json({message: "user already exist"})
    }
    const newUser = new userModal({
        name,
        email,
        password
    })
    try {
        const dataToSave = await newUser.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
    // users.push(req.body)

})
app.post("/v1/login",async(req,res)=>{
    let {email,password}=req.body
    try{
        const user = await userModal.findOne({email})
        console.log(user,"user")
        let token=""
        if (user && user.password===password){
            const id=user._id
            token=jwt.sign({id,email},process.env.SECRET_KEY)
            return res.json({token})
        }
        else{
            return res.json({message:"user not found",token})

        }


    }catch (error) {
        res.status(400).json({message: error.message})
    }
})

// todo list
let TODOLIST=[{"id":1,"title":"hello world this is by default task"}]
app.post("/createTask",verifyToken,async(req,res)=>{
    const {title,token} = req.body
    const {email}=jwt.verify(token,process.env.SECRET_KEY)
    // console.log(email,"userid")
    try {
        const user=await userModal.findOne({email})
        // console.log(user,"user")
        if (user){
            user.todo.push({title})
            await user.save()
            let todos = user.todo
            console.log(todos[todos.length-1],"todos");
            let data = todos[todos.length-1]
            return res.json({
                message:"item added successfully",
                data
            })
        }
    } catch (error) {
        return res.status(400).json({message:"you are not allowed to add todo"})
    }

})

app.get("/getTasks",verifyToken,async(req,res)=>{
    const {token} = req.body
    const {email}=jwt.verify(token,process.env.SECRET_KEY)
    try {

        const user=await userModal.findOne({email})
        return res.json(user.todo)
    }catch(error){
        return res.status(400).json({message:"permission not allowed"})
    }

})

app.delete("/removeTask/:todoId",verifyToken,async(req,res)=>{
    const {todoId} =req.params
    const {token}=req.body
    const decodedToken=jwt.verify(token,process.env.SECRET_KEY)
    const userId = decodedToken.id;
    try {
        const user = await userModal.findByIdAndUpdate(userId, {
            $pull: { todo: { _id: todoId } }
          }, { new: true });
          res.json({message:"item deleted",user})

    } catch (error) {
        res.json({message:error.message})
    }

})

app.put("/editTask/:todoId",verifyToken,async(req,res)=>{
    try {
        const { todoId } = req.params;
        const { token, new_title } = req.body;

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.id;
        const user = await userModal.findOneAndUpdate(
          { _id: userId, "todo._id": todoId },
          { $set: { "todo.$.title": new_title } },
          { new: true }
        );
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "something is wrong" });
      }

})
// console.log(users,"users");
app.listen(port, () => console.log(`Express app running on port ${port}!`));