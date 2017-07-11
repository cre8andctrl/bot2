'use strict'

const express = require('express')
const bodyParser  = require('body-parser')
const request = require('request')

const app = express()

app.set('port' , (process.env.PORT || 5000))
 
//Allow us to process data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Routes
app.get('/' , function(req , res){
	res.send("Hi I am a chatbot")
})

//facebook
app.get('/webhook/' , function(req ,res){
	if(req.query['hub.verify_token'] === "ryan"){
		res.send(req.query['hub.challenge'])
	}
	res.send("Token don't match")
})
//start the server
app.listen(app.get('port') , function(){
	console.log("Running: port")
})