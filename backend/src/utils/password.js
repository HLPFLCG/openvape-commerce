import bcrypt from 'bcryptjs';
import config from '../config/index.js';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, config.bcryptRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const validatePasswordStrength = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar),
  };
};

const calculatePasswordStrength = (password, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar) => {
  let strength = 0;

  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  if (hasUpperCase) strength += 1;
  if (hasLowerCase) strength += 1;
  if (hasNumbers) strength += 1;
  if (hasSpecialChar) strength += 1;

  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
};