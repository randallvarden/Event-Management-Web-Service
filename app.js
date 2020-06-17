const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const isUser = require('./middle/is-user');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

app.use(isUser);

app.use('/graphql', graphqlHttp({
    schema:graphqlSchema ,
   rootValue:graphqlResolvers,
    graphiql: true
}));

mongoose.connect(
    'mongodb+srv://manager:VkyGsqLozWira63v@cluster0-ejodc.mongodb.net/events-react-devs?retryWrites=true&w=majority'
    ).then(() =>{
        app.listen(8000);
    }).catch(err =>{
        console.log(err);
    })

