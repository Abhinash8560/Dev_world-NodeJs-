const express = require('express');
const app = express();

app.use("/test", (req, res) => {
    res.send('Hello from the Server!');
});
app.use("/", (req, res) => {
    res.send('namaste');
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});