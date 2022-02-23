const express = require('express')
var api = require('indian-stock-exchange');
var con = require('./database')
var bodyParser = require('body-parser')
const app = express()
var port = process.env.PORT || 3000
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: "application/json" }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
var lastPrice,price,marketprice; 
var nse = api.NSE;

async function getprice(symbol){
      const response =  await nse.getQuoteInfo(symbol)
      lastPrice =  response.data.data[0].lastPrice
      price = JSON.stringify(lastPrice).replaceAll('"', '').replaceAll(',', '')
      marketprice = parseFloat(price)
  }

app.get('/',function(req,res){
    //   var sql1 = `select symbol,quantity,avg_price,market_price from stock_details where 1=1`
    //   con.query(sql1, function (err, result, fields) {
    //     if(err) throw err;
    //       result.forEach(function(i){
    //            getprice(i.symbol).then(()=>{
    //             var sql2 = `update stock_details SET market_price = ${marketprice} WHERE symbol = "${i.symbol}"`
    //             con.query(sql2,function(err,result,fields){
    //               if(err) throw err;
    //           }) 
    //        })
    //       })  
    //   })
    //   var sql = `select symbol,quantity,avg_price,market_price from stock_details where 1=1`
    //   con.query(sql,function(err,result,fields){
    //     if(err) throw err;
    //     res.render("home", { data: result })
    // })
    getprice("TCS").then(()=>{
             res.json(lastPrice)
    })
})

app.post('/',function(req,res){
    var symbol = req.body.symbol
    var quantity = req.body.quantity
    var buyprice = req.body.buyprice
    var sql1 = `select symbol,quantity,avg_price,market_price from stock_details where symbol="${symbol}"`
    con.query(sql1,function(err,result,fields){
      if(err) throw err;
      if (result.length > 0){
        var quantity_new = result[0].quantity+parseInt(quantity)
        var buyprice_new = (result[0].avg_price*result[0].quantity + parseFloat(buyprice)*parseInt(quantity))/quantity_new
        var sql2 = `update stock_details SET quantity = ${quantity_new},avg_price = ${buyprice_new} WHERE symbol = "${symbol}"`
                con.query(sql2,function(err,result,fields){
                  if(err) throw err;
                  res.redirect('/')
              }) 
      
    }
      else{
          var sql = "INSERT INTO STOCK_DETAILS (symbol,quantity,avg_price) VALUES ('" + symbol + "','" + quantity + "','" + buyprice + "')"
          con.query(sql,function(err,result,fields){
              if(err) throw err;
              res.redirect('/')
          })
      }
  }) 
})
app.listen(port, function () {
  console.log(`Listeing to port on http://localhost:${port}`)
})