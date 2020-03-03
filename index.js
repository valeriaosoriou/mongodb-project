const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const config = require('./config.json');
const product = require('./products.json');

const port= 3000;

//CONNECT TO DB
const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_CLUSTER_NAME}-poi9f.mongodb.net/test?retryWrites=true&w=majority`;
// const mongodbURI = 'mongodb+srv://valeriaosoriou:Val3r1ta1@cluster0-poi9f.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true}) //we replace here with the mongo link password 
.then(()=> console.log('DB connected!'))
.catch(err =>{
  console.log(`DBConnectionError: ${err.message}`);
});

//test the connectivity
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('We are connected to mongo db');
});


app.use((req,res,next)=>{
  console.log(`${req.method} request for ${req.url}`);
  next(); //include this to go to the next middleware
});



//to see in the browser
app.get('/', (req, res) => res.send('Hello World!'))

//Requesting info from product json
app.get('/allProducts', (req,res)=>{
	res.json(product);
});

app.get('/products/p=:id', (req,res)=>{
	const idParam = req.params.id;
	for (let i = 0; i < product.length; i++){
		if (idParam.toString() === product[i].id.toString()){
			res.json(product[i]);
		
		}
	}
});


//keep this always at the bottom so that you can see the errors reported
app.listen(port, () => console.log(`Example app listening on port hihihihihi :D  ${port}!`))
