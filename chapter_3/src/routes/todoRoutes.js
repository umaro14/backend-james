
import express, { Router } from "express";
import db from "../db.js";

const router = express.Router();

//GET ALL THE TODOS FOR LOGGED-IN USERS
router.get("/", (req, res) => {
     const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?')
     const todos = getTodos.all(req.userId);
     res.json(todos);
});

//CREATE A NEW TODO
router.post("/", (req, res) => {
     const { task } = req.body;
     const inserTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES(?, ?)`)
     const result = inserTodo.run(req.userId,  task);

     res.json({id: result.lastInsertRowid, task, completed: 0 })
});

//UPDATE A TODO
router.put("/:id", (req, res) => {
     const { completed } = req.body;
     const { id } = req.params;
     const { page } = req.query;  //this will change nothing for the course


     const updatedTodo = db.prepare("UPDATE todos SET completed = ? WHERE id = ?");
     updatedTodo.run(completed, id);
     res.json({message: "Todod Completed"});

});

//DELETE A TODO
router.delete("/:id", (req, res) => {
     const { id } = req.params;
     const  userId = req.userId;
     const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id =?`);
     deleteTodo.run(id, userId);
     res.send({ message: "Todod deleted!" })
});

export default  router;
