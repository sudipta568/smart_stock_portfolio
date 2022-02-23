const express = require('express')
const app = express()
var port = process.env.PORT || 3000

app.get('/',function(req,res){
    res.end("Hello World")
})

app.listen(port, function () {
    console.log(`Listeing to port on http://localhost:${port}`)
  })