const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/check-grammar', async (req, res) => {
    try {
        const response = await axios.post('https://grammarbot.p.rapidapi.com/check', req.body, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': '5e2ccdc186msh5f6f488575d3757p125196jsn4ba6bcb25bed',
                'X-RapidAPI-Host': 'grammarbot.p.rapidapi.com'
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error checking grammar.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
