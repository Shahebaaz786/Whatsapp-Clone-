// importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';

// app config
const app = express();
const port = process.env.PORT || 21125; //if we have to launch this site then used this type of listener handler...


const pusher = new Pusher({
    appId: "1144693",
    key: "870b208ececa30cc1f71",
    secret: "58c0ca14f305a9091473",
    cluster: "eu",
    useTLS: true
  });

// middleware
app.use(express.json());    // we have used this because we have used json in body parser in postman...
app.use(cors());  // there is not need to write this below package if we use this line of code and this cors package
// app.use((req, res, next) => 
// {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', '*');
//     next();
// });

// DB config
mongoose.connect('mongodb+srv://Shahebaaz:Sanober@cluster0.5cflb.mongodb.net/whatsapp-mern?retryWrites=true&w=majority',
    {
        useCreateIndex:true,
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
);

// ????
const db = mongoose.connection;

db.once('open', () => 
{
    console.log("DB Connected...");

    const msgCollection = db.collection("messagecontents");     //plural form because it is get from cluster collection and it is in plural form of messagecontents
    const changeStream = msgCollection.watch();

    changeStream.on('change', (change) => 
    {
        console.log(change);

        if (change.operationType === "insert" )
        {
            const messageDetails = change.fullDocument;

            pusher.trigger('messages','inserted',   //channel is messages and event is inserted in pusher
            {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp:messageDetails.timestamp,
                received: messageDetails.received,
            });
        }
        else
        {
            console.log("Error triggering Pusher...");
        }
    });
});

// api routes  using node js with express js
app.get("/", (req, res) => 
{
    res.status(200).send("Hello Everyone...");      //200 = ok
});


app.get('/messages/sync/', (req, res) => 
{
    Messages.find((err, data) => 
    {
        if (err)
        {
            res.status(500).send(err);      //500 = internal server error
        }
        else
        {
            res.status(200).send(data);
        }
    });
});

app.post('/messages/new/', (req, res) => 
{
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => 
    {
        if (err)
        {
            res.status(500).send(err);
        }
        else
        {
            res.status(201).send(data);  //  201 = created ok
        }
    });
});

//listen
app.listen(port, () =>  console.log(`Listening on localhost: ${port}`  ));