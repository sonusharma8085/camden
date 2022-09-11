const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require("mysql");
const { Template } = require('ejs');

app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));

const connection = mysql.createConnection({
    host:'localhost',
    user:'sonu',
    password:'sonu',
    database:'node_crude_db'
});

connection.connect(function(error){
    if(error){
        console.log("Database Error", error);
    }else{
        console.log('Database Connected');
    }
})

app.get('/',function(req,res){
   let pagedata = {
        'title' :'Camden Home',
        'pageName':'home',
    }
    res.render('template',pagedata);
})

app.get('/create-product',function(req,res){
    let pageData = {
        'title':'Add Product',
        'pageName':"create-product",
    }
    res.render('template',pageData);
})

app.post('/create-product',function(req,res){
    // console.log(req.body);
    let title = req.body.title;
    let description = req.body.description;
    let price = req.body.price;
    let quantity = req.body.quantity;
    let isFeatured = req.body.isFeatured;
    let insertProduct = `INSERT INTO product(title, description, price, quantity, isFeatured) VALUES('${title}', '${description}', '${price}', '${quantity}', '${isFeatured}')`;
    console.log("insertProduct", insertProduct);

    connection.query(insertProduct,function(error,result){
        if(error){
            console.log('Database query error', error )
        }else{
            console.log("result", result);
            res.redirect('/product-list');
        }
    })
})

app.get("/product-list",function(req,res){
    let pageData ={
        'title': "All Product List",
        'pageName':"product-list",
    }
    let getproduct = "SELECT * FROM product";
    connection.query(getproduct,function(error,result){
        if(error){
            console.log("Database query error", error);
            
        }else{
            pageData.products = result;
            res.render('template',pageData);
        }
    })
});

///// category section

app.get('/create-category',function(req,res){
   let pageData = {
        'title': "Create Category",
        'pageName':"create-category"
    }
    res.render('template',pageData);
})

app.post('/create-category',function(req,res){
   let title = req.body.title;
   let description = req.body.description;
   let insertProduct = `INSERT INTO category(title, description) VALUES('${title}', '${description}')`;
   connection.query(insertProduct,function(error, result){
        if(error){
            console.log("Database Query Error ::: ", error);
        }else{
            res.redirect('/category-list');
        }
   })
})

app.get('/category-list',function(req,res){
    let pageData = {
        "pageName":"category-list",
        "title":"Category List" 
    }
    let allData = "SELECT * FROM category";
    connection.query(allData,function(error,result){
        if(error){

        }else{
            pageData.categorys = result;
            res.render("template",pageData);
        }
    })
    //  req.render();
})

app.get('/signup',function(req,res){
    let pageData ={
        'title': "Signup - Form",
        'pageName':"signup",
    }
    res.render('signup',pageData)
})

app.get('/login',function(req,res){
    let pageData ={
        'title': "Login - Form",
        'pageName':"login",
    }
    res.render('login',pageData)
})

const port = "4001";
app.listen(port,function(){
    console.log("server start");
})