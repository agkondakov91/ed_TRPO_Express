import express from 'express';

const app = express();
const PORT = 3000;

function logAdminAccess(_req, _res, next) {
	console.log('Кто-то заходит в админку');
	next();
}

app.use(express.json());

app.use((req, _res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

app.get('/', (_req, res) => {
	res.send('Привет! Это мой первый сервер на Express.');
});

app.get('/admin', logAdminAccess, (_req, res) => {
	res.send('Панель администратора');
});

// коллекция — работаем со списком целиком
app.get('/books', (req, res) => {
	const status = req.query.status;
	res
		.status(200)
		.send(`Список книг. Фильтр по статусу: ${status || 'нет фильтра'}`);
});

app.post('/books', (req, res) => {
	const { title, author } = req.body;
	res.status(201).send(`Книга создана: «${title}», автор — ${author}`);
});

// один элемент — работаем с конкретной книгой
app.get('/books/:id', (req, res) => {
	res.status(200).send(`Книга с id=${req.params.id}`);
});

app.put('/books/:id', (req, res) => {
	const { title, author } = req.body;
	res
		.status(200)
		.send(
			`Книга с id=${req.params.id} обновлена: «${title}», автор — ${author}`,
		);
});

app.delete('/books/:id', (_req, res) => {
	res.sendStatus(204);
});

app.listen(PORT, () => {
	console.log(`Сервер запущен: http://localhost:${PORT}`);
});
