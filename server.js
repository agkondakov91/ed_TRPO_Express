import { DatabaseSync } from 'node:sqlite'
import express from 'express';

const db = new DatabaseSync('bookshelf.db')

db.exec(`
	CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INTEGER,
    status TEXT NOT NULL DEFAULT 'хочу прочитать'
  )`
)

const selectAllBooks = db.prepare('SELECT * FROM books')
const selectBookById = db.prepare('SELECT * FROM books WHERE id = ?')
const insertBook = db.prepare('INSERT INTO books (title, author, year, status) VALUES (?, ?, ?, ?)')
const updateBookRow = db.prepare('UPDATE books SET title = ?, author = ?, year = ?, status = ? WHERE id = ?')
const deleteBook = db.prepare('DELETE FROM books WHERE id = ?')


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
	res.json(selectAllBooks.all())
});

app.get('/books/:id', (req, res) => {
	const book = selectBookById.get(Number(req.params.id))

	if (!book) {
		res.status(404).send('Книга не найдена');
		return;
	}

	res.json(book);
});

app.post('/books', validateBookData, (req, res) => {
	const { title, author, year, status } = req.body;

	const result = insertBook.run(title, author, year ?? 0, status || 'хочу прочитать')

	res.status(201).json(selectBookById.get(result.lastInsertRowid))
});

app.put('/books/:id', validateBookData, (req, res) => {
	const id = Number(req.params.id)
	const existing = selectBookById.get(id)

	if (!existing) {
		res.status(404).send('Книга не найдена');
		return;
	}

	const { title, author, year, status } = req.body;
	updateBookRow.run(title, author, year ?? 0, status || existing.status, id)

	res.json(selectBookById.get(id))
});

app.delete('/books/:id', (req, res) => {
	const id = Number(req.params.id)
	const existing = selectBookById.get(id)

	if (!existing) {
		res.status(404).send('Книга не найдена');
		return;
	}

	deleteBook.run(id)
	res.status(204).end()
});

app.get('/crash-test', async (_req, _res) => {
	throw new Error('Что-то сломалось внутри обработчика');
});

app.get('/sync-crash', (_req, _res) => {
	const data = null;
	console.log(data.title);
});

app.use(handleErrors);

app.listen(PORT, () => {
	console.log(`Сервер запущен: http://localhost:${PORT}`);
});
