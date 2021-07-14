require('dotenv').config();   
const Express = require('express');
const app = Express();
const dbConnection = require("./db");

const controllers = require("./controllers");

app.use(Express.json());

// app.use('/test', (req, res) => {
//     res.send('This is a message from the test endpoint on the server!')
// });

app.use('/user', controllers.userController);
app.use(require("./middleware/validate-session"));
app.use('/log', controllers.logController);

// app.listen(3000, () => {
//     console.log(`[Server]: App is listening on 3000`);
// });

dbConnection.authenticate()                       
    .then(() => dbConnection.sync())            
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: App is listening on ${process.env.PORT}`);
        });      
    })
    .catch((err) => {
        console.log("[Server]: Server crashed");
        console.log(err);
    })