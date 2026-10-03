const STATUSES = ['хочу прочитать', 'читаю', 'прочитал'];

let knownIds = new Set();

export function renderBookList(books, listElement, handlers) {
  listElement.replaceChildren();

  if (books.length === 0) {
    listElement.append(createEmptyState());
    knownIds = new Set();
    return;
  }

  books.forEach((book) => {
    const isNew = !knownIds.has(book.id);
    listElement.append(createBookCard(book, handlers, isNew));
  });

  knownIds = new Set(books.map((book) => book.id));
}

export function renderBookCount(books, countElement) {
  if (books.length === 0) {
    countElement.textContent = '';
    return;
  }

  const reading = books.filter((book) => book.status === 'читаю').length;
  countElement.textContent =
    reading > 0 ? `${books.length} книг, читаю ${reading}` : `${books.length} книг`;
}

function createBookCard(book, handlers, isNew) {
  const card = document.createElement('li');
  card.className = isNew ? 'book-card book-card--enter' : 'book-card';
  card.dataset.status = book.status;

  const spine = document.createElement('div');
  spine.className = 'book-card__spine';

  const body = document.createElement('div');
  body.className = 'book-card__body';

  const title = document.createElement('h3');
  title.className = 'book-card__title';
  title.textContent = book.title;

  const byline = document.createElement('p');
  byline.className = 'book-card__byline';
  byline.textContent = book.year ? `${book.author}, ${book.year}` : book.author;

  const footer = document.createElement('div');
  footer.className = 'book-card__footer';

  const statusSelect = createStatusSelect(book, handlers.onStatusChange);
  const actions = createActions(book, handlers);

  footer.append(statusSelect, actions);
  body.append(title, byline, footer);
  card.append(spine, body);

  return card;
}

function createStatusSelect(book, onStatusChange) {
  const select = document.createElement('select');
  select.className = 'book-card__status';
  select.setAttribute('aria-label', 'Статус чтения');

  STATUSES.forEach((status) => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status;
    option.selected = status === book.status;
    select.append(option);
  });

  select.addEventListener('change', () => onStatusChange(book, select.value));
  return select;
}

function createActions(book, handlers) {
  const actions = document.createElement('div');
  actions.className = 'book-card__actions';

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'icon-button';
  editButton.textContent = 'Изменить';
  editButton.addEventListener('click', () => handlers.onEdit(book));

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'icon-button icon-button--danger';
  deleteButton.textContent = 'Удалить';
  deleteButton.addEventListener('click', () => handlers.onDelete(book));

  actions.append(editButton, deleteButton);
  return actions;
}

function createEmptyState() {
  const li = document.createElement('li');
  li.className = 'book-grid__empty';
  li.textContent = 'Пока пусто — добавьте первую книгу выше';
  return li;
}
