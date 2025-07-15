import { HttpErrorResponse } from "@angular/common/http";

export function getErrorMessage(error: HttpErrorResponse): string {

    return (
        error.error?.message ||
        error.error?.error ||
        error.message ||
        (error.status + ' ' + error.statusText) ||
        'An unknown error occurred'
    );
}