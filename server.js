const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema.js');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(cors());

app.use('/graphql', expressGraphQL ({
    schema: schema,
    graphiql: true
}))


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})