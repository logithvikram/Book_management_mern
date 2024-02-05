import express, { response } from 'express';
import { PORT, MONGODB_URI } from './config.js';
import mongoose, { trusted } from 'mongoose';
import { Book } from './model/bookModel.js';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
    return res.status(234).send('<h1>hello</h1>')
})
console.log(`logith`);

app.post('/book', async (req, res) => {
    try {
        if (!req.body.title || !req.body.author || !req.body.publishYear) {
            return response.status(400).send({
                message: 'send all required field'
            })
        }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear
        }
        const book = await Book.create(newBook);

        return res.status(201).send(book);
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: error.message });
    }

})


app.get('/book', async (req, res) => {
    try {
        const books = await Book.find({});
        return res.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
})

app.get('/book/:id', async (req, res) => {
    try {

        const { id } = req.params;
        const book = await Book.findById(id);
        return res.status(200).json(book);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
})

app.put('/book/:id', async (req, res) => {
    try {
        if (!req.body.title || !req.body.author || !req.body.publishYear) {
            return response.status(400).send({
                message: 'send all required field'
            })
        }
        const {id} = req.params;
        const result = await Book.findByIdAndUpdate(id,req.body);
        if(!result){
        return res.status(404).json({message:'book not found'});}

        return res.status(200).send({message:'Book update successfully'});


    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
})

app.delete('/book/:id',async(req,res)=>{
    try {
        const { id } = req.params;
        const result = await Book.findByIdAndDelete(id);
        if(!result)
        return res.status(404).json({message:'book not found'})
        return res.status(200).send({message:'book deleted succe'})
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message })
    }
})

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("connected with data base")
        app.listen(PORT, () => {
            console.log(`app running in port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })
