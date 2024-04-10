const express = require('express')
const app = express()
const dotenv = require('dotenv');
dotenv.config({path: './.env'});

app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).json({status: 'success'})
})

app.listen(process.env.PORT, () => {
    console.log("Server is live!");
})