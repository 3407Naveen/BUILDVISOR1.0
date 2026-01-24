export type ValidationResult = {
    isValid: boolean;
    error?: string;
};

/**
 * Validates a project name based on the following rules:
 * - Max 100 characters.
 * - Lowercase only (no uppercase letters).
 * - Allowed: lowercase letters, digits, '.', '_', '-'.
 * - Forbidden: the sequence '---'.
 */
export function validateProjectName(name: string): ValidationResult {
    if (!name) {
        return { isValid: false, error: 'Project name is required' };
    }

    if (name.length > 100) {
        return { isValid: false, error: 'Project name must be 100 characters or less' };
    }

    if (/[A-Z]/.test(name)) {
        return { isValid: false, error: 'Project name must be lowercase' };
    }

    // Only allow letters, digits, '.', '_', '-'
    if (!/^[a-z0-9._-]+$/.test(name)) {
        return { isValid: false, error: 'Only letters, digits, ".", "_", and "-" are allowed' };
    }

    if (name.includes('---')) {
        return { isValid: false, error: 'Project name cannot contain "---"' };
    }

    return { isValid: true };
}
