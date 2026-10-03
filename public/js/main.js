import { createBook, deleteBook, fetchBooks, updateBook } from './api.js';
import { renderBookCount, renderBookList } from './dom.js';
import { openEditDialog } from './edit-dialog.js';
import { ApiError } from './errors.js';
import { showError } from './notifications.js';

const listElement = document.getElementById('book-list');
const formElement = document.getElementById('book-form');
const countElement = document.getElementById('book-count');

const handlers = {
  onStatusChange: handleStatusChange,
  onEdit: handleEditRequest,
  onDelete: handleDelete,
};

async function loadBooks() {
  try {
    const books = await fetchBooks();
    renderBookList(books, listElement, handlers);
    renderBookCount(books, countElement);
  } catch (error) {
    reportError(error, 'Не удалось загрузить список книг');
  }
}

async function handleCreate(event) {
  event.preventDefault();
  const formData = new FormData(formElement);
  const title = formData.get('title');
  const author = formData.get('author');
  const year = Number(formData.get('year'));

  try {
    await createBook({ title, author, year });
    formElement.reset();
    await loadBooks();
  } catch (error) {
    reportError(error, 'Не удалось добавить книгу');
  }
}

async function handleStatusChange(book, status) {
  try {
    await updateBook(book.id, { ...book, status });
    await loadBooks();
  } catch (error) {
    reportError(error, 'Не удалось обновить статус');
  }
}

async function handleEditRequest(book) {
  const changes = await openEditDialog(book);

  if (!changes) {
    return;
  }

  try {
    await updateBook(book.id, { ...book, ...changes });
    await loadBooks();
  } catch (error) {
    reportError(error, 'Не удалось сохранить изменения');
  }
}

async function handleDelete(book) {
  try {
    await deleteBook(book.id);
    await loadBooks();
  } catch (error) {
    reportError(error, 'Не удалось удалить книгу');
  }
}

function reportError(error, fallbackMessage) {
  const message = error instanceof ApiError ? error.message : fallbackMessage;
  showError(message);
  console.error(error);
}

formElement.addEventListener('submit', handleCreate);

loadBooks();
