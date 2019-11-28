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


// this is comment test1

// this is comment test2

// this is comment test3

// this is keyword test 123abcfffffff333333333gggggggggaaaaa

// keyword 2 dfgdfggh5654654dfghfghfghfg

// keyword test3 iuhkjhgfdghjdfg4895793485yjsdkhjdfg

// gdfgdfgdfgd34534534dfbdf1erfdhujtyu
