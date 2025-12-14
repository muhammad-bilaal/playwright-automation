export const stagingData = {
  user1: {
  //
  },
};
export const invalidUserData = {
  email1: 'invalid_email',
  email2: 'invalid@',
  email3: 'user@@marketscale.com',
  email4: 'abc@.com',
  email5: 'test_user@marketscale',
  email6: 'notregistered@marketscale.com',
  emptyEmail: '',
  emptyPassword: '',
  invalidPassword: 'AnyPassword123!',
  missingSpecialChar: 'ARbi123.',
  missingSpecialCharAndNumber: 'ARbi123',
  missingFirstCharUppercase: 'Rbi123.,',
  missingRequiredPattern: 'RandomPass@1',
  missingLetters: '12345678',
  missingNumbers: 'Password!@#',
};

export const emailAndPasswordError = {
  emailError: 'Please provide a valid email',
  emptyEmailError: 'Please enter your email',
  emptyPasswordError: 'Please enter your password',
  invalidEmailOrPassword: 'Invalid email or password',
};
