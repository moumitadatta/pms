const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
const mongoUri = "mongodb+srv://moudattain2024:moumita12345@moutech.ktlrj.mongodb.net/pms?retryWrites=true&w=majority&appName=moutech";

// Connect to database
// Connect to database


connectDB(mongoUri);
// Route files
const auth = require('./routes/authRoutes');
const projects = require('./routes/projectRoutes');
const tasks = require('./routes/taskRoutes');
const attendance = require('./routes/attendanceRoutes');
const leaves = require('./routes/leaveRoutes');
const holidays = require('./routes/holidayRoutes');
const timesheets = require('./routes/timesheetRoutes');
const tickets = require('./routes/ticketRoutes');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Cookie parser
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000', // local dev frontend
    'https://pms-client-oyd9.onrender.com' // deployed frontend on Render
  ],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));


// Add this after CORS but before routes




// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security middleware
app.use(helmet());

// Mount routers
app.use('/api/v1/auth', auth);
// app.use('/api/v1/projects', projects);
// app.use('/api/v1/tasks', tasks);
// app.use('/api/v1/attendance', attendance);
// app.use('/api/v1/leaves', leaves);
// // app.use('/api/v1/holidays', holidays);
// app.use('/api/v1/timesheets', timesheets);
// app.use('/api/v1/tickets', tickets);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5005;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app.listen(PORT, () =>
console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`)
);

// Graceful shutdown
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
