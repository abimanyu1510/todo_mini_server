import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config()
//create instance express
const app=express();
app.use(express.json());

//cors
app.use(cors());

//define a route 
app.get("/",(req,res)=>{
    res.send("Hello World!")
})

//sample in memory storage for todo items

// let todos=[];


//create a new todo item
app.post('/todos',async (req,res)=>{
  const {title,description} = req.body;
//   const newTodo = {
//     id:todos.length+1,
//     title,
//     description
//   };
//  todos.push(newTodo);
//  console.log(todos);
try {
    const newTodo = new todoModel({title,description})
    await newTodo.save(); 
    res.status(201).json(newTodo);  
} catch (error) {
    console.log(error);
    res.status(500).json({message:error.message})
}

})


//Get all todos:
app.get("/todos",async (req,res)=>{
    try {
       const todos= await todoModel.find();
       res.json(todos);

    } catch (error) {

        console.log(error);
        res.status(500).json({message:error.message})  
    }
    
})


//update todo item
app.put("/todos/:id",async(req,res)=>{
   try {

    const {title,description}=req.body;
    const id= req.params.id;
    const updatedTodo= await todoModel.findByIdAndUpdate(
     id,
     {title,description},
     {new:true},
    )

    if(!updatedTodo){
 
     return res.status(404).json({message:"Todo not Found"})
    }
    res.json(updatedTodo);

   } catch (error) {
    console.log(error);
    res.status(500).json({message:error.message})  
   }

})


//Delete a todo item:
app.delete("/todos/:id",async (req,res)=>{
    try {
        
        const id=req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end(); 
    } catch (error) {

        console.log(error);
        res.status(500).json({message:error.message});
    }


})






//create schema
const todoShema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
            type:String,
            required:true,   
    }
})

//create model
const todoModel=mongoose.model("Todo",todoShema)




//connect mongodb
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("db connected")
})
.catch((err)=>{
    console.log(err)
})

//start the server:
const PORT=8000;
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
});
