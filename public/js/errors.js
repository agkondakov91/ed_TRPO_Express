export class ApiError extends Error {
	constructor(message, { status, cause } = {}) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		if (cause) {
			this.cause = cause;
		}
	}
}
