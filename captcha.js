const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 1337;

app.use(express.json());
app.use(cookieParser('777'));
app.use(express.static(__dirname + '/src'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

app.get('/captcha', (req, res) => {
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    const arrChar = ['Z', 'g', '2', '9', '5', '7', 'k', 'K', 'T', 'f'];
    const arrText = [];
    while (arrText.length <= 4) {
        arrText.push(arrChar[getRandomInt(arrChar.length)]);
    }
    const text = arrText.join('');
    res.cookie('captcha', text);
    res.status(200).json({ text });
});

app.post('/form', (req, res) => {
    const { captcha } = req.body;
    if (captcha === req.cookies.captcha) {
        return res.sendStatus(200);
    }
    res.sendStatus(401);
});

app.listen(PORT, () => {
    console.log(`Server worked! [${PORT}]`);
});
