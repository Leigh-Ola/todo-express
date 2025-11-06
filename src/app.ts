import express from 'express';
import tasksRouter from './routes/tasks.routes';
import notFound from './middleware/notFound';
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/tasks', tasksRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
