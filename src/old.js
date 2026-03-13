const express = require('express');
const app = express();
const {adminAuth,UserAuth}=require('./middleware/auth');

app.use("/admin",adminAuth);
app.use('/user',UserAuth);

//This will only handle GET call to /user
// app.get('/user/:userId/:status', (req, res) => {
//     console.log(req.params);
//     res.send({firstname:"Abhi",Lastname:"Kumar"})
// })

//Handle Auth Middleware for all GET Post,.... requests
app.use('/admin',adminAuth);
app.use('/user',UserAuth);

app.get('/user/7', (req, res) => {
    res.send("User 7 Data Sent")
})
app.get('/admin/getAllData', (req, res) => {
    res.send("All Data Sent")
})

// app.delete('/user', (req, res) => {
//   //saving data to database
//     res.send("Data deleted from the database")
// })


//This will match all the http method API calls to /test
// app.use("/test", (req, res) => {
//     res.send('Hello from the Server!');
// });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});