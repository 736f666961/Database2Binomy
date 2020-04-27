const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Include stylesheets and images
app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({extended : false}));

// Set Engine
app.set('view engine', 'ejs');

// ======== Connected MySQL via NodeJS========
const db = mysql.createConnection({
    host:'localhost',
    user:'admin',
    password:'nasa',
    database:'Products'
});

// Check if database is connected ... !
db.connect(function(error){
    if(error) console.log(error);
    else console.log(`Connected to database Data... !`)
}); 

// Set views aka where to look for files
app.set('views', 'views');

app.get("/electroProducts", (req, res) => {
    // const sql = "SELECT * FROM cards";
    // const query = db.query(sql, (err, data) => {
    //     if(err) console.log(err);
    //     else{
    //         res.render('home', {
    //             cards : data
    //         });
    //     }
                
    // });
    res.render("eclectroProducts", {})
});

app.get("/fruitProducts", (req, res) => {
    res.render("fruitProducts", {})
});

// When user trying to create a new quote
app.post("/newCard", (req, res) => {
    // Get data from user
    let data = {
        pictureUrl: "./img/" + req.body.pictureUrl,
        name: req.body.name,
        description: req.body.description
    };

    db.query('INSERT INTO cards SET ?', data, function (err, result) {
      if (err) throw err;
      res.redirect('/');

    });

    // res.end("Data Created Successfuly ... !")
});

// QUOTE Editing 
app.get('/edit/:cardId',(req, res) => {
    const cardId = req.params.cardId;

    res.render("editQuote", {
        cardId : req.params.cardId
    });

    app.post('/edit/' + cardId,(req, res) => {
        let sql = `Update cards SET pictureUrl='../img/${req.body.pictureUrl}', name='${req.body.name}', description='${req.body.description}' where ID=${cardId}`;
        let query = db.query(sql, (err, results) => {
          if(err) throw err;
          res.redirect('/');
        });
    });
});

// Quote Deleting
app.get("/delete/:cardId", (req, res) => {
    const cardId = req.params.cardId;
    let sql = `DELETE FROM cards where ID=${cardId}`;
    let query = db.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

//  Listing Server 
app.listen(4000, () => {
    console.log('server is rinning')
});