'use strict'

const express = require('express')
const bodyParser  = require('body-parser')
const request = require('request')
var mysql = require('mysql');

var qry;
const app = express()


app.set('port' , (process.env.PORT || 5000))
 
//Allow us to process data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Routes
app.get('/' , function(req , res){
	res.send("Hi I am a chatbot")
})

let token = ""

//facebook
app.get('/webhook/' , function(req ,res){
	if(req.query['hub.verify_token'] === "ryan"){
		res.send(req.query['hub.challenge'])
	}
	res.send("Token don't match kasi eh")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	
	var con = mysql.createConnection({
	host: "",
	user: "",
	password: "",
	database: ""
	});

	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			
			
			con.connect(function(err) {
				if (err) throw err;
				con.query("SELECT * FROM users WHERE username ='"+text+"'", function (err, result, fields) {
				if (err) throw err;

				//qry = query(result)
				//sendText(sender, "Text echos: "+ JSON.stringify(result))
				
				var jsonresult = JSON.stringify(result);
				//jsonresult = JSON.parse(jsonresult);
				
				sendText(sender, "Text echo "+ jsonresult)
				
			});
			});
			
			//sendText(sender, "Text echo: " + text.substring(0, 100))
		}
	}
	res.sendStatus(200)
})


function query(qry){
	return qry;	
}

function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})
