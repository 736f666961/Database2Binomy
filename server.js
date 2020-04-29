const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
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
    user:'root',
    password:'',
    database:'stock'
});

// Check if database is connected ... !
db.connect(function(error){
    if(error) console.log(error);
    else console.log(`Connected to database Data... !`)
}); 

// Set views aka where to look for files
app.set('views', 'views');

// When User request home page
app.get("/", (req, res) => {
    const sql = "SELECT * FROM ryon";
    const query = db.query(sql, (err, data) => {
        if(err) console.log(err);
        else{
            res.render('Home', {
                products : data
            });
        }
                
    });

});


// When request the product page of some ryon
app.get("/ryon/:productId", (req, res) => {
    // Get id from url
    let productId = req.params.productId;

    // Writing sql commands
    const sql = "CREATE TABLE IF NOT EXISTS newProduct" + productId + "(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, image varchar(255), name varchar(255), quantity int(11) NOT NULL, price float NOT NULL) ;"

    // Exeecute sql commands
    const query = db.query(sql, (err, data) => {
        if(err) throw err;
        else{
            db.query("SELECT * FROM newProduct" + productId, (err, data) => {
                if (err) throw err;
                res.render('addnewproducts', {
                    products : data,
                    productId: productId
                });
            });
        }  
        
    });

    // Show results
    console.log("-- Request : ryon/" + productId);

    // Writing to check file
    fs.writeFileSync("check", productId);
});

// Creating New Products
app.post("/newProduct/:productId", (req, res) => {
    // Get Id From Url
    let productId = req.params.productId;

    // Get data from user
    let data = {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        quantity: req.body.quantity
    };

    // Check table exists
    let sql = "CREATE TABLE IF NOT EXISTS newProduct" + productId + "(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, image varchar(255), name varchar(255), quantity int(11) NOT NULL, price float NOT NULL);";
    db.query(sql, function (err, result) {
        if (err) throw err;
        else{
            db.query('INSERT INTO newProduct' + productId + ' SET ?', data, (err, result) => {
                if (err) throw err;
            });
        }
      });
      res.end("Product added successfully !");

    // Show results
    console.log("-- Request : newProduct/" + productId);
      
});

// Editing New Products
app.get('/editProduct/:productId',(req, res) => {
    let productId = req.params.productId;

    // Reading from file
    let rf = fs.readFileSync("check", "utf8");

    // Rendering editProducts Page
    res.render("editProducts", {
        productId : req.params.productId
    });

    app.post('/editProduct/' + productId,(req, res) => {
        let sql = `Update newProduct` + rf + ` SET image='${req.body.image}', name='${req.body.name}', quantity='${req.body.quantity}', price='${req.body.price}' where id=${productId}`;
        let query = db.query(sql, (err, results) => {
          if(err) throw err;
        });
        res.end("Product edited successfully !");
    });

    // console.log("request : /editProducts : | " + productId);
    console.log("Updating table newProduct" + rf);
    console.log("Requesting /editProduct" + productId);
    console.log("This will execute Update table newProduct" + rf + " where id=" + productId);
});

// When request electroProduct Static Page
app.get("/electroProducts", (req, res) => {
    res.render("eclectroProducts", {})
});

// When request fruitProducts Static Page
app.get("/fruitProducts", (req, res) => {
    res.render("fruitProducts", {})
});

// Create table for each newly created ryon
app.post("/newRyon", (req, res) => {
    // Get data from user
    let data = {
        name: req.body.name,
        image: req.body.image
    };

    // Get number of created tables
    db.query('INSERT INTO ryon SET ?', data, function (err, result) {
      if (err) throw err;
      res.redirect('/');
    });

    // Creating check file for reading later new product
    if (fs.existsSync("check")){
        // Reading from check file
        let rf = fs.readFileSync("check", 'utf8');

        // Increment check file value by 1
        fs.writeFileSync("check", rf++);
    }else{
        fs.writeFileSync("check", 0);
    }

});

// Quote new products
app.get("/delete/:productId", (req, res) => {
    const productId = req.params.productId;
    // Reading from file
    let rf = fs.readFileSync("check", "utf8");

    let sql = `DELETE FROM newProduct` + rf + ` where ID=${productId}`;
    db.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/');
    });

    // Show results
    console.log("Deleting newProduct" + rf + " where id=" + productId);
});

// Deleting ryon from home
app.get("/deleteRyon/:ryonId", (req, res) => {
    const ryonId = req.params.ryonId;
    // Reading from file
    let rf = fs.readFileSync("check", "utf8");

    let sql = `DELETE FROM ryon where ID=${ryonId}`;
    db.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/');
    });

    // Show results
    console.log("Deleting from table ryon where id=" + ryonId);
});

// Editing Ryon From Home
app.get('/editRyon/:productId',(req, res) => {
    let productId = req.params.productId;

    // Reading from file
    let rf = fs.readFileSync("check", "utf8");

    // Rendering editProducts Page
    res.render("editingRyon", {
        productId : req.params.productId
    });

    app.post('/editRyon/' + productId,(req, res) => {
        let sql = `Update ryon SET image='${req.body.image}', name='${req.body.name}' where id=${productId}`;
        db.query(sql, (err, results) => {
          if(err) throw err;
        });
        res.end("Ryon edited successfully !");
    });

    // console.log("request : /editProducts : | " + productId);
    // console.log("Updating table newProduct" + rf);
    console.log("Requesting /editRyon" + productId);
    console.log("This will execute Update table newProduct" + rf + " where id=" + productId);
});

//  Listing Server 
app.listen(4000, () => {
    console.log('server is rinning')
});