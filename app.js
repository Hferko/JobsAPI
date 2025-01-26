require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

// Routers
const authRouter = require('./routes/authRouter')
const jobRouter = require('./routes/jobsRouter')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages
app.set('trust proxi', 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 100,
  max:100
}))
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`A szerver a ${port} porton figyel`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
