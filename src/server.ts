import cors from 'cors';
import express from 'express';
import { router } from './routes';
import { errorHandlerMiddleware } from './middlewares/eror-handler';

const app = express();

app.use(cors());
app.use("/api",router);
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`App running in http://localhost:${PORT}`));