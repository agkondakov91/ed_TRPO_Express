import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (_req, res) => {
    res.send('Привет! Это мой первый сервер на Express.');
});

app.get('/books', (_req, res) => {
    res.status(200).send('Список книг');
});

app.post('/books', (_req, res) => {
    res.status(201).send('Книга создана');
});

app.put('/books', (_req, res) => {
    res.status(200).send('Книга обновлена');
});

app.delete('/books', (_req, res) => {
    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
