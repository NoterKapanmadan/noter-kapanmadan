import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import clientStorage from './routes/clientStorage.js';
import serverStorage from './routes/serverStorage.js';

dotenv.config();

const app = express()
const port = process.env.PORT || 8465


app.use(cors());
app.use(express.json());


const defaultRouter = express.Router();

defaultRouter.get('/', (req, res) => {
  res.send('This is image server!')
})

defaultRouter.use('/public', express.static('public'))
defaultRouter.use('/clientStorage', clientStorage);
defaultRouter.use('/serverStorage', serverStorage);

app.use('/', defaultRouter);
  
app.listen(port, () => {
  console.log(`Image server listening on port ${port}`)
})