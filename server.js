import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (_req, res) => {
	res.send('Привет! Это мой первый сервер на Express.');
});

// коллекция — работаем со списком целиком
app.get('/books', (_req, res) => {
	res.status(200).send('Список книг');
});

app.post('/books', (_req, res) => {
	res.status(201).send('Книга создана');
});

// один элемент — работаем с конкретной книгой
app.get('/books/:id', (req, res) => {
	res.status(200).send(`Книга с id=${req.params.id}`);
});

app.put('/books/:id', (req, res) => {
	res.status(200).send(`Книга с id=${req.params.id} обновлена`);
});

app.delete('/books/:id', (_req, res) => {
	res.sendStatus(204);
});

app.listen(PORT, () => {
	console.log(`Сервер запущен: http://localhost:${PORT}`);
});
