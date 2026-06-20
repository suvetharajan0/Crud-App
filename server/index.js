const express = require("express");
let users=require("./sample.json");
const cors=require("cors");
const fs=require("fs");



const app=express()
app.use(express.json());
app.use(cors({
  origin:"http://localhost:5173",
  methods:["GET","POST","PUT","PATCH","DELETE"],
}));

const port=8000;
 app.get("/users",(req,res)=>{
   return res.json(users);
 })
 app.delete("/users/:id",(req,res)=>{
  const id= Number(req.params.id);
  let filteredUsers=users.filter((user)=>user.id!= Number(id));
  users=filteredUsers;
  fs.writeFile("./sample.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete users" });
    }
    return res.json(users);
  });
 });
app.post("/users",(req,res)=>{
 let {name,age,city}=req.body;
 if(!name || !age || !city){
   return res.status(400).send({message: "All fields are required"})
 }
 let id=Date.now();
 users.push({id,name,age,city});
 fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
  return res.json(users);
 })
})
 
 app.patch("/users/:id",(req,res)=>{
  const id=Number(req.params.id);
  const {name,age,city}=req.body;
  if(!name || !age || !city){
    res.status(400).send({message: "All fields are required"})
   }
   let index=users.findIndex((user)=>user.id===id);
   users.splice(index,1,{...req.body});
   fs.writeFile("./sample.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update user" });
    }
    return res.json(users);
  });
 });

app.listen(port,(err)=>{
    console.log(`Server is running on http://localhost:${port}`);
})