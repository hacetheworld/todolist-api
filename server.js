const express = require('express');
const bodyParser = require('body-parser');
const jwt=require("jsonwebtoken")
const verifyToken = require("./middleware")
const app = express();
const port = 3000;

// To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: true }));
// To parse json data
app.use(bodyParser.json());

const users=[]

app.post("/v1/signup",(req,res)=>{
    users.push(req.body)
    // console.log(users);
    res.json(req.body)

})
app.post("/v1/login",(req,res)=>{
    let {email,password}=req.body
    let flg=true
    for (let user of users){
        if (email===user.email){
            if (password===user.password){
                flg=false
            }
        }
    }
    console.log(email,password);
    let token=jwt.sign({email:req.body.email},"xyz")
      const decoded = jwt.verify(token,"xyz");
      console.log(decoded);
    console.log(token,"tokrn");
    res.json({"message":flg,token})
})

// todo list
let TODOLIST=[{"id":1,"title":"hello world this is by default task"}]
app.post("/createTask",(req,res)=>{
    const {id, title} = req.body
    data = {id, title}
    TODOLIST.push(data)
    console.log(data)
    res.json({
        message:"item added successfully",
        data
    })
})

app.get("/getTasks",(req,res)=>{
    res.json({
        TODOLIST
    })

})

app.delete("/removeTask/:id",verifyToken,(req,res)=>{
    const {id} = req.params
    TODOLIST = TODOLIST.filter((item)=>item.id !== id)
    res.json({
        TODOLIST
    })

})

app.put("/editTask/:id",(req,res)=>{
    const {id} = req.params
    const {title} = req.body
    TODOLIST.forEach((item)=> {
        if(item.id === id){
            item.title = title
        }
    })
    res.json({
        TODOLIST
    })

})
console.log(users,"users");
app.listen(port, () => console.log(`Express app running on port ${port}!`));