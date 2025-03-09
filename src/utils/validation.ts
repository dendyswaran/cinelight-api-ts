// Validation utilities for user input

interface LoginInput {
  username: string;
  password: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates login input data
 * @param input Login input data
 * @returns Array of validation errors, empty if valid
 */
export function validateLoginInput(input: LoginInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate username
  if (!input.username) {
    errors.push({
      field: 'username',
      message: 'Username is required'
    });
  } else if (typeof input.username !== 'string') {
    errors.push({
      field: 'username',
      message: 'Username must be a string'
    });
  } else if (input.username.trim().length < 3) {
    errors.push({
      field: 'username',
      message: 'Username must be at least 3 characters'
    });
  }

  // Validate password
  if (!input.password) {
    errors.push({
      field: 'password',
      message: 'Password is required'
    });
  } else if (typeof input.password !== 'string') {
    errors.push({
      field: 'password',
      message: 'Password must be a string'
    });
  } else if (input.password.length < 3) {
    // In a real app, this would be stronger (e.g., min 8 chars)
    errors.push({
      field: 'password',
      message: 'Password must be at least 3 characters'
    });
  }

  return errors;
}

/**
 * Validates equipment category input
 * @param input Category input data
 * @param isUpdate Whether this is an update operation (some fields optional)
 * @returns Array of validation errors, empty if valid
 */
export function validateCategoryInput(input: any, isUpdate = false): ValidationError[] {
  const errors: ValidationError[] = [];

  // Name is required for create, optional for update
  if (!isUpdate || input.name !== undefined) {
    if (!input.name) {
      errors.push({
        field: 'name',
        message: 'Category name is required'
      });
    } else if (typeof input.name !== 'string') {
      errors.push({
        field: 'name',
        message: 'Category name must be a string'
      });
    } else if (input.name.trim().length < 2) {
      errors.push({
        field: 'name',
        message: 'Category name must be at least 2 characters'
      });
    }
  }

  // Description is optional but must be a string if provided
  if (input.description !== undefined && typeof input.description !== 'string') {
    errors.push({
      field: 'description',
      message: 'Description must be a string'
    });
  }

  // IsActive is optional but must be a boolean if provided
  if (input.isActive !== undefined && typeof input.isActive !== 'boolean') {
    errors.push({
      field: 'isActive',
      message: 'IsActive must be a boolean'
    });
  }

  return errors;
}

/**
 * Validates equipment input
 * @param input Equipment input data
 * @param isUpdate Whether this is an update operation (some fields optional)
 * @returns Array of validation errors, empty if valid
 */
export function validateEquipmentInput(input: any, isUpdate = false): ValidationError[] {
  const errors: ValidationError[] = [];

  // Name is required for create, optional for update
  if (!isUpdate || input.name !== undefined) {
    if (!input.name) {
      errors.push({
        field: 'name',
        message: 'Equipment name is required'
      });
    } else if (typeof input.name !== 'string') {
      errors.push({
        field: 'name',
        message: 'Equipment name must be a string'
      });
    }
  }

  // CategoryId is required for create, optional for update
  if (!isUpdate || input.categoryId !== undefined) {
    if (!input.categoryId) {
      errors.push({
        field: 'categoryId',
        message: 'Category ID is required'
      });
    } else if (isNaN(parseInt(input.categoryId))) {
      errors.push({
        field: 'categoryId',
        message: 'Category ID must be a number'
      });
    }
  }

  // Price validation
  if (!isUpdate || input.dailyRentalPrice !== undefined) {
    if (input.dailyRentalPrice === undefined || input.dailyRentalPrice === null) {
      errors.push({
        field: 'dailyRentalPrice',
        message: 'Daily rental price is required'
      });
    } else if (isNaN(parseFloat(input.dailyRentalPrice))) {
      errors.push({
        field: 'dailyRentalPrice',
        message: 'Daily rental price must be a number'
      });
    } else if (parseFloat(input.dailyRentalPrice) < 0) {
      errors.push({
        field: 'dailyRentalPrice',
        message: 'Daily rental price cannot be negative'
      });
    }
  }

  // Quantity validation
  if (!isUpdate || input.quantity !== undefined) {
    if (input.quantity === undefined || input.quantity === null) {
      errors.push({
        field: 'quantity',
        message: 'Quantity is required'
      });
    } else if (isNaN(parseInt(input.quantity))) {
      errors.push({
        field: 'quantity',
        message: 'Quantity must be a number'
      });
    } else if (parseInt(input.quantity) < 0) {
      errors.push({
        field: 'quantity',
        message: 'Quantity cannot be negative'
      });
    }
  }

  return errors;
}

/**
 * Validates quotation input
 * @param input Quotation input data
 * @param isUpdate Whether this is an update operation (some fields optional)
 * @returns Array of validation errors, empty if valid
 */
export function validateQuotationInput(input: any, isUpdate = false): ValidationError[] {
  const errors: ValidationError[] = [];

  // Client name is required for create, optional for update
  if (!isUpdate || input.clientName !== undefined) {
    if (!input.clientName) {
      errors.push({
        field: 'clientName',
        message: 'Client name is required'
      });
    } else if (typeof input.clientName !== 'string') {
      errors.push({
        field: 'clientName',
        message: 'Client name must be a string'
      });
    }
  }

  // Issue date is required for create, optional for update
  if (!isUpdate || input.issueDate !== undefined) {
    if (!input.issueDate) {
      errors.push({
        field: 'issueDate',
        message: 'Issue date is required'
      });
    } else {
      try {
        new Date(input.issueDate);
      } catch (e) {
        errors.push({
          field: 'issueDate',
          message: 'Issue date must be a valid date'
        });
      }
    }
  }

  // Email validation if provided
  if (input.clientEmail) {
    if (!isValidEmail(input.clientEmail)) {
      errors.push({
        field: 'clientEmail',
        message: 'Invalid email format'
      });
    }
  }

  return errors;
}

/**
 * Sanitizes strings to prevent XSS attacks
 * @param input String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  // Simple sanitization - replace HTML special chars
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validates an email address
 * @param email Email to validate
 * @returns True if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
