import express from 'express';

const app = express();

const port = 9000;
const message = 'Hello World';

app.get('/', (_req, res) => res.send(message));

app.listen(port);
console.log(`[app]: http://localhost:${port}`);