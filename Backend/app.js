const express = require('express')
const app = express();
require('express-async-errors')
const routes = require('./routes/routes')

const cors = require("cors");

app.use(cors())
app.use(express.json());

app.get('/',(req,res)=>{
  res.json({res:"Success"})
})

app.use('/api/v1/views/',routes)

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


app.listen(3002,()=>{
  console.log("Server listening on port 3002")
})