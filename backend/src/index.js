const express= require('express')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json'); 
const router=require('./routes/user')
const uploadrouter = require('./routes/upload')
const searchRouter = require('./documents/search')
const askRouter = require('./routes/ask')
const studyMaterialRouter = require('./routes/study-material')
const path = require('path');
const cors=require('cors')
const app= express()
app.use(express.json())
app.use(cors())


app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/personalized-quiz", require("./routes/personalized-quiz"));
app.use("/api/progress", require("./routes/progress"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/auth", require("./routes/auth"))
app.use("/api/revision", require("./routes/revision"))
app.use('/api/subjects', require('./routes/subjects'))
app.use('/api/documents', require('./routes/documents'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/upload',uploadrouter)
app.use("/api/ask", askRouter);
app.use("/api/search", searchRouter);
app.use('/api',router) 



app.use("/api/study-material", studyMaterialRouter);
app.get('/',(req,res)=>{
    res.send("Hello World")
}   )

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})