const dialog = document.getElementById('edit-dialog');
const form = document.getElementById('edit-form');
const cancelButton = document.getElementById('edit-cancel');

export function openEditDialog(book) {
	form.elements.title.value = book.title;
	form.elements.author.value = book.author;
	form.elements.year.value = book.year || 0;

	return new Promise((resolve) => {
		function onSubmit(event) {
			event.preventDefault();
			const changes = {
				title: form.elements.title.value,
				author: form.elements.author.value,
				year: form.elements.year.value
					? Number(form.elements.year.value)
					: null,
			};
			cleanup();
			dialog.close();
			resolve(changes);
		}

		function onCancelClick() {
			cleanup();
			dialog.close();
			resolve(null);
		}

		function onDialogClose() {
			cleanup();
			resolve(null);
		}

		function cleanup() {
			form.removeEventListener('submit', onSubmit);
			cancelButton.removeEventListener('click', onCancelClick);
			dialog.removeEventListener('close', onDialogClose);
		}

		form.addEventListener('submit', onSubmit);
		cancelButton.addEventListener('click', onCancelClick);
		dialog.addEventListener('close', onDialogClose);

		dialog.showModal();
	});
}
