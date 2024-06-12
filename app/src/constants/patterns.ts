export const PASSWORD_PATTERNS = new RegExp(
  '^(?=.{8,})(?=.*?\\d)(?=.*[\\s!#$\\%&\\(\\)\\*\\+\\,\\-\\/\\:;<=>?])(?=[a-zA-Z0-9]).*$'
);

export const MOBILE = '(max-width: 48em)';

export const VALIDATION_MESSAGES = {
  email: 'Valid email is required.',
  password: 'Your password is not strong enough.',
  passwordRequired: 'Password field is required.',
  firstName: 'First name is required.',
  lastName: 'Last name is required.',
  fullName: 'Full name is required.',
  message: 'Message is required.',
  age: 'Age must be provided.',
  image: 'Avatar must be set.',
  title: 'Task title field is required to be between 2 and 80 chars.'
};
