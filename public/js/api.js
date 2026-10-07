import { ApiError } from './errors.js';

const BOOKS_URL = '/books';

async function request(url, options) {
	let response;

	try {
		response = await fetch(url, options);
	} catch (networkError) {
		throw new ApiError('Не удалось связаться с сервером', {
			cause: networkError,
		});
	}

	if (!response.ok) {
		const text = await response.text();
		throw new ApiError(text || `Сервер ответил ошибкой ${response.status}`, {
			status: response.status,
			cause: response,
		});
	}

	if (response.status === 204) {
		return null;
	}

	return response.json();
}

export function fetchBooks() {
	return request(BOOKS_URL);
}

export function createBook(data) {
	return request(BOOKS_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
}

export function updateBook(id, data) {
	return request(`${BOOKS_URL}/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
}

export function deleteBook(id) {
	return request(`${BOOKS_URL}/${id}`, { method: 'DELETE' });
}
