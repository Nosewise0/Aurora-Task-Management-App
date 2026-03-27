const ERRORS = {
    401: {
        heading: "Authentication Required",
        message: "You need to be signed in to access this page. Please log in and try again.",
    },
    403: {
        heading: "Access Denied",
        message: "You don't have permission to perform this action. If you believe this is a mistake, contact the project owner.",
    },
    404: {
        heading: "Page Not Found",
        message: "The page you're looking for doesn't exist or may have been moved.",
    },
    500: {
        heading: "Something Went Wrong",
        message: "An unexpected server error occurred. Please try again in a moment.",
    },
};

export function renderError(res, statusCode, customMessage) {
    const defaults = ERRORS[statusCode] || ERRORS[500];
    res.status(statusCode).render("error", {
        statusCode,
        heading: defaults.heading,
        message: customMessage || defaults.message,
    });
}
