const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //to parse all data coming from the user and db
const cors = require('cors'); //to include cross orgin request
const bcryptjs = require('bcryptjs'); //to hash and compare password in an encrypted method
const config = require('./config.json'); //has credentials
const product = require('./products.json'); //external json data from mockaroo api
const dbProduct = require('./models/products.js');
const User = require('./models/users.js');

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

//INCLUDING BODY-PARSER, CORS, BCRYPTJS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use (cors());

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

//RESGISTER USER 
app.post('/registerUser', (req,res)=>{
	//checking if user is found in the db already
	User.findOne({username: req.body.username}, (err, userResult)=>{
		if (userResult){
			res.send('username taken already. Please try another time');
		}else{
		const hash = bcryptjs.hashSync(req.body.password); //hash the password
   		const user = new User({
    		_id : new mongoose.Types.ObjectId,
    		username : req.body.username,
    		email : req.body.email,
    		password :req.body.password
   		});
   		//Save to database and notify the user accordingly
   		user.save().then(result =>{ 
    	res.send(result);
   		}).catch(err => res.send(err));
		}
	}) 	
});

//GET ALL USERS
app.get('/allUsers', (req,res)=>{
	User.find().then(result=>{
		res.send(result);
	})
});

//LOGIN THE USER
app.post('/loginUser', (req,res)=>{
  User.findOne({username:req.body.username},(err,userResult)=>{
    if (userResult){
      if (bcryptjs.compareSync(req.body.password, userResult.password)){
        res.send(userResult);
      } else {
        res.send('not authorized');
      }//inner if
    } else {
       res.send('user not found. Please register');
    }//outer if
  });//findOne
});//post


//keep this always at the bottom so that you can see the errors reported
app.listen(port, () => console.log(`Example app listening on port hihihihihi :D  ${port}!`))
