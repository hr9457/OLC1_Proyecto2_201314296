const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

//settings
app.set('port',process.env.PORT||3500);

//middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//routes
app.use(require('./routers/peticiones'));


//startin server
app.listen(app.get('port'),() => {
    console.log('Server on port',app.get('port'));
})