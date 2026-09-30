const list = document.getElementById('book-list');
const form = document.getElementById('book-form');
const STATUSES = ['хочу прочитать', 'читаю', 'прочитал'];

let booksCache = [];

async function loadBooks() {
	const response = await fetch('/books');
	booksCache = await response.json();
	renderBooks();
}

function renderBooks() {
	list.innerHTML = booksCache
		.map(
			(book) => `
    <li class="book">
      <div class="book__info">
        <strong>${book.title}</strong> — ${book.author}${book.year ? ` (${book.year})` : ''}
      </div>
      <select class="book__status" data-id="${book.id}">
        ${STATUSES.map((s) => `<option value="${s}" ${s === book.status ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
      <button class="book__edit" data-id="${book.id}">Изменить</button>
      <button class="book__delete" data-id="${book.id}">Удалить</button>
    </li>
  `,
		)
		.join('');
}

function findBook(id) {
	return booksCache.find((book) => book.id === Number(id));
}

async function updateBook(id, changes) {
	const payload = { ...findBook(id), ...changes };
	await fetch(`/books/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});
	loadBooks();
}

form.addEventListener('submit', async (event) => {
	event.preventDefault();
	const title = document.getElementById('title').value;
	const author = document.getElementById('author').value;

	await fetch('/books', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title, author }),
	});

	form.reset();
	loadBooks();
});

list.addEventListener('click', (event) => {
	const id = event.target.dataset.id;
	if (!id) return;

	if (event.target.classList.contains('book__delete')) {
		fetch(`/books/${id}`, { method: 'DELETE' }).then(loadBooks);
	}

	if (event.target.classList.contains('book__edit')) {
		const current = findBook(id);
		const title = prompt('Новое название:', current.title);
		const author = prompt('Новый автор:', current.author);
		if (!title || !author) return;
		updateBook(id, { title, author });
	}
});

list.addEventListener('change', (event) => {
	if (event.target.classList.contains('book__status')) {
		updateBook(event.target.dataset.id, { status: event.target.value });
	}
});

loadBooks();
