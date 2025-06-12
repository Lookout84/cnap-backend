import express from 'express';
import { json } from 'body-parser';
import { createConnection } from './config/database';
import routes from './routes/index';
import errorMiddleware from './middlewares/error.middleware';
import environment from './config/environment';

const app = express();
const PORT = environment.PORT || 3000;

// Middleware
app.use(json());

// Database connection
createConnection();

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});