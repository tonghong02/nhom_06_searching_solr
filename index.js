var bodyParser =	require("body-parser");
var express  = require('express');
var port     = process.env.PORT || 3000;

var app      = express();

// set up our express application
app.use("/assets", express.static(__dirname + "/public"));
app.use("/script", express.static(__dirname + "/node_modules"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

app.get('/university', (req, res) => {
    res.render('university.ejs')
})

app.get('/', (req, res) => {
    res.render('index.ejs')
})


app.listen(port, () => {
    console.log('The server listen on port ' + port);
});

