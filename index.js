const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookie = require('cookie');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');


// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const mongoose = require('mongoose');

// --- Database Connection ---

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION)
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('Failed to connect to MongoDB', err);

});


const app = express();
const port = process.env.PORT || 5000;

// --- Security Middleware ---

app.use(helmet());

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max 200 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// --- Core Middleware ---

// Enable CORS for all origins
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Compress responses with gzip
app.use(compression());

// --- Logging Middleware ---

// Morgan for logging HTTP requests in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Routes ---

// Basic route to check if the server is running

const suppliersRouter = require('./routes/suppliers');
app.use('/api/suppliers', suppliersRouter);


const invoiceRouter = require('./routes/invoices');
app.use('/api/invoices', invoiceRouter);

const productRouter = require('./routes/product');
app.use('/api/products', productRouter);

const orderRouter = require('./routes/order');
app.use('/api/orders', orderRouter);

const spinningRouter = require('./routes/spinning');
app.use('/api/spinning', spinningRouter);

const weavingRouter = require('./routes/weaving');
app.use('/api/weaving', weavingRouter);

const manufacturingRouter = require('./routes/manufacturing');
app.use('/api/manufacturing', manufacturingRouter);

const dyeingRouter = require('./routes/dyeing');
app.use('/api/dyeing', dyeingRouter);

const procuremnetOrdersRouter = require('./routes/procurement');
app.use('/api/procurementOrders', procuremnetOrdersRouter);

const faUserRouter = require('./routes/fieldAgent');
app.use('/api/faUser', faUserRouter);

app.get('/', (req, res) => {
  res.send('FiberSync Backend is running!');
});


app.post('/api/set-user-session', async (req, res) => {
  try {
    const { name, role, companyName , userAddress } = req.body;

    // Create a JWT token
    const token = jwt.sign(
      { name, role, companyName , userAddress },
      process.env.JWT_SECRET, // Use a secret key from environment variables
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.json({ message: 'User session set in cookie', token });
  } catch (error) {
    console.error('Error setting user session:', error);
    res.status(500).json({ message: 'Error setting user session' });
  }
});



// --- Error Handling ---

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});



// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port: ${port}`);
});
