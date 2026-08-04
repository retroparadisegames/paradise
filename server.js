var http = require('http'),
    fs = require('fs'),
    express = require('express'),
    app = express();

const { preflight } = require('./preflight');

app.use(express.json());

app.use("/css", express.static('css'));
app.use("/img", express.static('img'));
app.use("/oob", express.static('img'));
app.use("/games", express.static('games'));
app.use("/scripts", express.static('scripts'));

app.get('/demo', (req,res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('games/demo.html', 'utf-8', (err, content) => {
        if (err) {
            throw err;
        }
        res.end(content);
    });
});

app.post('/api/preflight', (req, res) => {
    const message = req.body && typeof req.body.message === 'string' ? req.body.message : '';
    res.json(preflight(message));
});

http.createServer(app).listen(9999);

console.log("App running on 9999");
