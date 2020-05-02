// Import necessary packages
const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

// Include stylesheets and images
app.use(express.static(__dirname));

// Use body parser middleware
app.use(bodyParser.urlencoded({extended : false}));

// Set Engine
app.set('view engine', 'ejs');

// Connect to MySQL via NodeJS
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'stock'
});

// Check if database is connected ... !
db.connect(function(error){
    if(error) console.log(error);
    else console.log(`Connected to database ... !`)
}); 

// Set views aka where to look for files
app.set('views', 'views');

// When User request home page
app.get("/", (req, res) => {
    const sql = "SELECT * FROM ryon";
    db.query(sql, (err, data) => {
        if(err) console.log(err);
        else{
            res.render('Home', {
                products : data
            });
        }           
    });
});

// When request the product page from some ryon
app.get("/ryon/:productId", (req, res) => {
    // Get id from url
    let productId = req.params.productId;

    // Show results
    // console.log("-- Request : ryon/" + productId);
    // console.log("ProductId From get: " + productId);

    // Writing to check file
    if (!(isNaN(parseInt(productId)))){
        // Writing sql commands
        const sql = "CREATE TABLE IF NOT EXISTS newProduct" + productId + "(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, image varchar(255), name varchar(255), quantity int(11) NOT NULL, price float NOT NULL) ;"

        // Exeecute sql commands
        db.query(sql, (err, data) => {
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
        fs.writeFileSync("check", productId);
        // console.log("It's not NaN");
    }else{
        // console.log("It's NaN");
        console.log("");
    }
});

// When user request some "Fournisseur" from some product
app.get("/fournisseur/:fournisseurId", (req, res) => {
    let fournisseurId = req.params.fournisseurId;

    // Reading cghecl file
    let rf = fs.readFileSync("check", "utf8");

    // Showing the corespnding fournisseur
    db.query(`SELECT * FROM fournisseur WHERE ID=${rf}`, (err, data) => {
        try{
            if (err) throw err.message;
            if (data[0] != undefined){
                let checkId = data[0].ID;
                // console.log("-- rf == checkId " + rf + " == " + checkId);
                // console.log("== check Ternary:  " + rf == checkId ? true : false);
                res.render('fournisseur', {
                    fournisseurs : data,
                    fournisseurId: fournisseurId,
                    bool: rf == checkId ? true : false
                });
   
            }else{
                res.render('fournisseur', {
                    fournisseurs : data,
                    fournisseurId: fournisseurId,
                    bool: false
                });

            }
        }catch(err){
            console.log("Error: " + err);
        }
    });

    // Create new fournisseur
    app.post("/newFournisseur/" + fournisseurId, (req, res) => {
        if ((req.body.name != "" && req.body.name.match(/[a-zA-Z]/)) && 
        (req.body.email.indexOf("@") != -1) && 
        (req.body.phone.match(/[0-9]/) && req.body.phone != "" && !(req.body.phone.match(/[a-zA-Z]/))) && 
        (req.body.address != "" )){
            // Get data from user
            let data = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
            };

            // Check fournisseur
            let checkForni = `SELECT id as ID FROM fournisseur WHERE ID=${fournisseurId}`;
            db.query(checkForni, (err, result) => {
                try{
                    if(err) throw err.message;
                    let id = result[0];
                    if (id != null){
                        // console.log("From (If) id > 0 : " + id);
                        if (id == fournisseurId){
                            console.log("id == fournisseurID : " + id + " == " + fournisseurId);
                            res.end("This product is already has a fourisseur ... !");
                        }else{
                            // console.log("-- (Else) : id > 0 but id != fournisseur id : " + id + " != " + fournisseurId);
                            db.query('INSERT INTO fournisseur SET ?', data, (err, result) => {
                                if (err) throw err;
                                // res.end("New Fournisseur Created !");
                                res.redirect("/fournisseur/" + fournisseurId);
                            });                  
                        }
                    
                    }else{
                        db.query('INSERT INTO fournisseur SET ?', data, (err, result) => {
                            if (err) throw err;
                            // res.end("New Fournisseur Created !");
                            res.redirect("/fournisseur/" + fournisseurId);
                        });
                    }
                    // Debugging
                    // console.log("id (Else) : " + id.ID);
                    // console.log("Fournisseur.ID: " + fournisseurId);
                }catch(err){
                    console.log("Error: " + err);
                }
            });
        }else{
            res.end("<h1>Invalid Form</h1>")
        }

    });
});

// Creating New Products
app.post("/newProduct/:productId", (req, res) => {
    // Get Id From Url
    let productId = req.params.productId;

    // Check User Inputs
    if ((req.body.name != "" && req.body.name.match(/[a-zA-Z]/)) && 
        (req.body.picture != "") && 
        (req.body.price.match(/[0-9]/) && req.body.price != "" && !(req.body.price.match(/[a-zA-Z]/))) && 
        (req.body.quantity.match(/[0-9]/) && req.body.quantity != "" && !(req.body.price.match(/[a-zA-Z]/)))){
        // Get data from user
        let data = {
            name: req.body.name,
            image: req.body.image,
            price: req.body.price,
            quantity: req.body.quantity
        };

        // Create table if not exists
        let sql = "CREATE TABLE IF NOT EXISTS newProduct" + productId + "(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, image varchar(255), name varchar(255), quantity int(11) NOT NULL, price float NOT NULL);";
        db.query(sql, function (err, result) {
            if (err) throw err;
            else{
                db.query('INSERT INTO newProduct' + productId + ' SET ?', data, (err, result) => {
                    if (err) throw err;
                });
                // Debugging
                // console.log("2 - NewProductId From get: " + productId);
            }
        });

        // Show response to user
        // res.end("Product added successfully !");
        res.redirect("/ryon/" + productId);
        // Show results
        // console.log("-- Request : newProduct/" + productId);
    }else{
        res.end("<h1>Invalid Inputs</h1>");

        // Debugging
        // console.log("Invalid Form !...");
        // console.log("3 - NewProductId From get: " + productId);
    }

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

    // Editing product
    app.post('/editProduct/' + productId,(req, res) => {
        let sql = `Update newProduct` + rf + ` SET image='${req.body.image}', name='${req.body.name}', quantity='${req.body.quantity}', price='${req.body.price}' where id=${productId}`;
        let query = db.query(sql, (err, results) => {
          if(err) throw err;
        });

        // Show response to user
        res.end("Product edited successfully !");
    });

    // Debugging
    // console.log("Updating table newProduct" + rf);
    // console.log("Requesting /editProduct" + productId);
    // console.log("This will execute Update table newProduct" + rf + " where id=" + productId);
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
    if ((req.body.name != "" && req.body.name.match(/[a-zA-Z]/)) &&  (req.body.picture != "")){
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
    }else{
        // res.end("Invalid Inputs");
    }
});

// Delete new products
app.get("/delete/:productId", (req, res) => {
    const productId = req.params.productId;

    // Reading which ryon you are in
    let rf = fs.readFileSync("check");

    // Deleting product
    let sql = `DELETE FROM newProduct` + rf + ` where ID=${productId}`;
    db.query(sql, (err, results) => {
      if(err) throw err;
      // wriring file that conatins this products
      res.redirect('/');
    });

    // Show results
    // console.log("Deleting newProduct" + rf + " where id=" + productId);

    // End response
    // res.end()
});

// Deleting ryon from home
app.get("/deleteRyon/:ryonId", (req, res) => {
    // Get id from url
    const ryonId = req.params.ryonId;
    
    // Reading from file
    // let rf = fs.readFileSync("check", "utf8");

    // Sql language command
    let deleteRyon = `DELETE FROM ryon where ID=${ryonId}`;

    // let checkTable = `SELECT MAX(id) FROM newProduct` + ryonId +`;`;
    // SELECT MAX(id) AS maxId FROM newproduct1;
    let checkTable = `SELECT MAX(id) as maxId FROM newProduct` + ryonId +`;`;

    // console.log("SELECT MAX(ID) FROM newProduct" + ryonId);
    db.query(checkTable, (err, chTable) => {
        try{
            if(err) throw err.message;
            // console.log("--Max(id) : " + chTable[0].maxId);
            let id = chTable[0].maxId;
            if (id == null){
                // Delete ryon
                db.query(deleteRyon, (err, result) => {
                    if (err) throw err;
                });
                // console.log("You can delete table ryon");
            }else{
                // console.log("You can not delete table ryon");
            }
        }catch(err){
            // console.log("Error: " + err);
            console.log(err);
        }finally{
            // console.log("Mission done");
            console.log("");
        }
    }); 
    
    // End response
    res.redirect("/");
    
    // Show results
    // console.log("Deleting from table ryon where id=" + ryonId);
});

// Editing Ryon From Home
app.get('/editRyon/:productId',(req, res) => {
    // Get Id from url
    let productId = req.params.productId;

    // Reading from file
    fs.readFileSync("check", "utf8");

    // Rendering editProducts Page
    res.render("editingRyon", {
        productId : req.params.productId
    });

    // For editing existing ryon from home
    app.post('/editRyon/' + productId,(req, res) => {
        let sql = `Update ryon SET image='${req.body.image}', name='${req.body.name}' where id=${productId}`;
        db.query(sql, (err, results) => {
          if(err) throw err;
        });

        // Show response to user
        // res.end("Ryon edited successfully !");
        res.redirect("/");
    });

    // Show results
    // console.log("Requesting /editRyon" + productId);
    // console.log("This will execute Update table newProduct" + rf + " where id=" + productId);
});

//  Listing Server 
app.listen(4000, () => {
    console.log('server is running at port 4000')
});