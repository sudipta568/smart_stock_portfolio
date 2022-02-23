const mysql = require('mysql')

const con  = mysql.createPool(
    {
        connectionLimit : 100,
        host: "us-cdbr-east-04.cleardb.com",
        user: "b69da4c7e6310a",
        password: "412bad2e",
        database: "heroku_c6e69731ef27b6b"
    }
)

// con.connect(function(err){
//     if (err) throw err;
//     console.log("Connected")
// })

con.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
  
module.exports = con