const AUTO_DISMISS_MS = 4500;

export function showError(message) {
	const container = getContainer();

	const toast = document.createElement('div');
	toast.className = 'toast';
	toast.setAttribute('role', 'alert');

	const spine = document.createElement('div');
	spine.className = 'toast__spine';

	const text = document.createElement('p');
	text.className = 'toast__message';
	text.textContent = message;

	toast.append(spine, text);
	container.append(toast);

	requestAnimationFrame(() => toast.classList.add('toast--visible'));

	setTimeout(() => dismiss(toast), AUTO_DISMISS_MS);
}

function dismiss(toast) {
	toast.classList.remove('toast--visible');
	toast.addEventListener('transitionend', () => toast.remove(), { once: true });
}

function getContainer() {
	let container = document.getElementById('toast-container');

	if (!container) {
		container = document.createElement('div');
		container.id = 'toast-container';
		container.className = 'toast-container';
		document.body.append(container);
	}

	return container;
}
