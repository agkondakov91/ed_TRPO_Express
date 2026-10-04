import express from 'express';

const books = [
	{
		id: 1,
		title: 'Дюна',
		author: 'Фрэнк Герберт',
		year: 1965,
		status: 'прочитал',
	},
	{
		id: 2,
		title: 'Чистый код',
		author: 'Роберт Мартин',
		year: 2008,
		status: 'читаю',
	},
	{
		id: 3,
		title: 'Задача трёх тел',
		author: 'Лю Цысинь',
		year: 2008,
		status: 'хочу прочитать',
	},
];

let nextId = 4;

const app = express();
const PORT = 3000;

function logAdminAccess(_req, _res, next) {
	console.log('Кто-то заходит в админку');
	next();
}

function validateBookData(req, res, next) {
	const { title, author, year } = req.body;

	if (!title || !author) {
		res.status(400).send('Нужно указать title и author');
		return;
	}

	if (year !== undefined && typeof year !== 'number') {
		res.status(400).send('Поле year должно быть числом');
		return;
	}

	next();
}

function handleErrors(err, _req, res, _next) {
	console.error(err.stack);
	res.status(500).json({
		status: 'error',
		message: 'Что-то пошло не так на сервере',
	});
}

app.use(express.json());
app.use(express.static('public'));

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

app.get('/books', (_req, res) => {
	res.json(books);
});

app.get('/books/:id', (req, res) => {
	const book = books.find((b) => b.id === Number(req.params.id));

	if (!book) {
		res.status(404).send('Книга не найдена');
		return;
	}

	res.json(book);
});

app.post('/books', validateBookData, (req, res) => {
	const { title, author, year, status } = req.body;

	const newBook = {
		id: nextId++,
		title,
		author,
		year: year ?? null,
		status: status || 'хочу прочитать',
	};

	books.push(newBook);
	res.status(201).json(newBook);
});

app.put('/books/:id', validateBookData, (req, res) => {
	const book = books.find((book) => book.id === Number(req.params.id));

	if (!book) {
		res.status(404).send('Книга не найдена');
		return;
	}

	const { title, author, year, status } = req.body;

	book.title = title;
	book.author = author;
	book.year = year ?? null;
	book.status = status || book.status;

	res.json(book);
});

app.delete('/books/:id', (req, res) => {
	const index = books.findIndex((book) => book.id === Number(req.params.id));

	if (index === -1) {
		res.status(404).send('Книга не найдена');
		return;
	}

	books.splice(index, 1);
	res.status(204).end();
});

app.get('/crash-test', async (_req, _res) => {
	throw new Error('Что-то сломалось внутри обработчика');
});

app.get('/sync-crash', (_req, _res) => {
	const data = null;
	console.log(data.title); // попытка обратиться к свойству null — упадёт синхронно
});

app.use(handleErrors);

app.listen(PORT, () => {
	console.log(`Сервер запущен: http://localhost:${PORT}`);
});
