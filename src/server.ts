import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import apiRouter from './controllers';
import { env } from './env';
import { banner } from './libs/banner';
import { globalErrorHandler } from './middlewares/error';
import { Logger } from './libs/logger';
import { connectMongoDB } from './libs/mongoose';

const app = express();
const log = new Logger(__filename);

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('short'));

banner(log);

// Health Check
app.get('/scraper/health', async (req, res) => {
    res.send('OK');
});

app.use('/scraper', apiRouter);

// Handling 404
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// Handling custom error
app.use(globalErrorHandler);

connectMongoDB()
    .then(() => {
        app.listen(env.app.port, () => {
            console.log(
                `server started on port ${env.app.port}, env: ${process.env.NODE_ENV}`
            );
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    });

process.on('SIGINT', async () => {
    console.log('Shutting down openai streaming service...');

    process.exit(0);
});
