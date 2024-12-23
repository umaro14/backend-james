
//THESE FIRST 4 LINES ARE ALL WE NEED TO OFFICIALLY FOR OUR SEVER TO LISTEN TO THE INCOME REQUESTS OVER THE INTERNET

//The address of this server connected to the network is:
// URL -> http://localhost:8383
// IP -> 127.0.0.1:8383

const express = require('express');
const  app = express();
const PORT = 8383;

let data = {
    name : "John"
}


//MIDDLEWARE...CONFIGURES OUR SERVER TO EXPECT JSON DATA
app.use(express.json());


//HTTP VERBS(METHODS)  & ROUTES OR PATHS
//THE METHOD INFORMS THE NATURE OF REQUEST AND THE ROUTE IS A FURTHER SUBDIRECTORY
//THESE LOCATIONS OR ROUTES ARE CALLED END  POINTS
//THE ROUTE IS THE PATH THAT THE REQUEST IS BEING SENT TO


//TYPR-1 : Website endpoints (these endpoints are for sending html and they
//typically come when a user enters a url in a browser)

//THIS IS ENDPOINT NUMBER 1 -/
app.get('/', (req, res) =>{
    res.send(`
        <body 
         style="background: pink;
         color:blue"
         >
        <h1>Data</h1>
         <p>
           ${JSON.stringify(data)}
         </p>
        </body>
        `)
})

app.get('/dashboard', (req, res) => {
    console.log('ohhh now i hit the /dashboard endpoint');
    res.send('<h1>Dashboard</h1>');
})



//TYPE-2 API endpoint (non visual)

/*CRUD{
CREATE -> POST
READ -> GET
UPDATE -> PUT
DELETE -> DELETE
}*/

app.get('/api/data', (req, res) => {
    console.log('This one was for data');
    res.send(data);
})

app.post('/api/data', (req, res) => {
    //someone wants to create a user (ex: when they click a sign up buttom)
    //the user clicks the sign up button afterentering their credentials
    //their brtowser is wired up to send out a network request to the server to the 
    //handle that action
    const newEntry = req.body
    console.log(newEntry)
    res.sendStatus(201)
   
})

app.listen(PORT, () => console.log(`Server has started on: ${PORT}`))