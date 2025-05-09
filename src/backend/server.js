import dotenv from 'dotenv';
import express from 'express';

const app = express()
const PORT = process.env.PORT || 3500

dotenv.config();

app.use(express.json())

 app.listen(3500, () => {
    console.log(`Server is running on port ${PORT}`)
})
