import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import path from 'path'
import {fileURLToPath} from 'url'
import {dirname} from 'path'
import dotenv from 'dotenv'
import expressValidator  from 'express-validator'
import userRouter from './routes/userRoutes.js'
import homeRouter from './routes/homeRoutes.js'
import authRouter from './routes/authRoutes.js'
import meetiAdminRouter from './routes/meetiAdminRoutes.js'
import meetiRouter from './routes/meetiRoutes.js'
import groupRouter from './routes/groupRoutes.js'
import bodyParser from 'body-parser'
import flash from 'connect-flash'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from './config/passport.js'

// Db and Models
import db from './config/db.js'
import Users from './models/Users.js'
import Categories from './models/Categories.js'
import Groups from './models/groups.js'
import Meeti from './models/Meeti.js'
import CategoriesGroups from './models/CategoriesGroups.js'
import Comments from './models/Comments.js'


// PSQL PORT = 5432
// .env variables
dotenv.config({path: '.env'})

// App
const app = express();

// Body Parser , read forms
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Express Validator
//app.use(expressValidator());

// Enable EJS as template engine
app.use(expressLayouts);
app.set('view engine','ejs');

// Helper function to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Views folder
app.set('views', path.join(__dirname, '/views'));

// Static folder
app.use(express.static(path.join(__dirname, '/public')));

//Enable cookie-parser
app.use(cookieParser());

app.use(session({
    secret: process.env.SECRET, // This is the secret
    key: process.env.KEY, // This is the key
    resave: false,
    saveUninitialized: false
}));

// Start Passport
app.use(passport.initialize());
app.use(passport.session());


// Enable flash messages
app.use(flash());

// Middleware (logged user, flash messages, current date)
app.use((req,res,next) => {
    res.locals.user = {...req.user} || null;
    res.locals.messages = req.flash();
    const date = new Date();
    res.locals.year = date.getFullYear();
    next();
});

// Routing
app.use('/',homeRouter);
app.use('/',userRouter);
app.use('/',authRouter);
app.use('/',meetiAdminRouter);
app.use('/',groupRouter);
app.use('/',meetiRouter);

db.sync().then(() => console.log('Database connected')).catch(err => console.log(err));

// Add the port
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;
app.listen(port, host,() =>{
    console.log(`Server is running on port ${port}`);
});