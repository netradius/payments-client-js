export class PaymentError extends Error {
    readonly statusCode: number;
}

export class ValidationError extends PaymentError {
    readonly statusCode = 400;

    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

export class ForbiddenError extends PaymentError {
    readonly statusCode = 403;

    constructor() {
        super("Forbidden");
        this.name = "ForbiddenError";
    }
}

export class NotFoundError extends PaymentError {
    readonly statusCode = 404;

    constructor() {
        super("NotFound");
        this.name = "NotFoundError";
    }
}

export class ConflictError extends PaymentError {
    readonly statusCode = 409;

    constructor() {
        super("Conflict");
        this.name = "ConflictError";
    }
}

export class NotImplementedError extends PaymentError {
    readonly statusCode = 501;

    constructor() {
        super("NotImplemented");
        this.name = "NotImplementedError";
    }
}
