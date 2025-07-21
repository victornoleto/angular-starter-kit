
export function generatePlaceholderString(length: number): string {
    return 'x'.repeat(length);
}

export function generatePlaceholderVariableString(minLength: number, maxLength: number): string {
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    return generatePlaceholderString(length);
}