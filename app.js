require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.get('/signup.html', function(req, res) {
    res.sendFile('/signup.html');
})


app.post("/signup.html", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/10fbdd298e";

    const options = {
        method: "POST",
        auth: process.env.API_KEY
    }

    const request = https.request(url, options, function(response) {
        console.log(response.statusCode);
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post('/failure.html', function(req, res) {
    res.redirect('/signup.html');
})

app.listen(process.env.PORT || 3000, function() {
    console.log("server is running on port 3000");
})
