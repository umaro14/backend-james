
import express, { Router } from "express";
import bcrypt from "bcryptjs";  //ENCRYPTS DATA
import jwt from "jsonwebtoken";
import db from "../db.js";
import prisma from "../prisma.Client.js";

const router = express.Router();

//REGISTER A NEW USER ENDPOINT /auth/register
router.post("/register", async (req, res) => {
    const { username, password } = req.body
    // we save the username and an irreversibly encrypted password
    // we save gilegum@gmail.com | lhttrokr..4tgijntt...r5t3poijto..gtt4.ghgh.4.44hgthg..wqew

    //encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8);
    // Save the new user and hashed password to the db...
    try {
         const user = await prisma.user.create({             // Example: Create a new user
            data: {
                username,
                password: hashedPassword
            }
         })

            // now that we have a user, I want to add their first todo for them
            const defaultTodo = 'Hello :) Add your first todo!';
            await prisma.todo.create({
                data:{
                    task: defaultTodo,
                    userId: user.id
                }
            })
            

            //create a token 
            const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'});
            res.json({ token })
        

    } catch (err) {
        console.log(err.message)
        res.sendStatus(503);
    }
});

router.post("/login", (req, res) => {
    // we get their email, and we look up their passaword associated with that email in the database
    // but we get it back and see it's encrypted, which means that we cannot compare it to the one 
    // we got from the user, because it's encrypted, so what we have to do , is again, one way encrypt the password
    // the user just entered and compare it to one in the databse...

    const { username, password } = req.body;

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = getUser.get(username);
        
        // if we cannot a user associated with that username, return out from the function
        if(!user) {return res.status(404).send({message: "user not found"})};

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        // if the password does not match, return out of the function
        if(!passwordIsValid) { return res.status(401).send({message: "Invalid password"})};
        console.log(user)

        // then we have a successful authentication
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "24h"});
        res.json( {token} );


    } catch (err) {
        console.log(err.message);
        res.send(503);
    }
    
})

export default router;