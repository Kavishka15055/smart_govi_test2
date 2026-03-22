import { TFunction } from 'i18next';

export const getLocalizedError = (error: any, t: TFunction): string => {
  if (!error || !error.code) {
    return t('auth.errors.generic');
  }

  switch (error.code) {
    case 'auth/invalid-credential':
      return t('auth.errors.invalidCredential');
    case 'auth/user-not-found':
      return t('auth.errors.userNotFound');
    case 'auth/wrong-password':
      return t('auth.errors.wrongPassword');
    case 'auth/invalid-email':
      return t('auth.errors.invalidEmail');
    case 'auth/email-already-in-use':
      return t('auth.errors.emailInUse');
    case 'auth/weak-password':
      return t('auth.errors.weakPassword');
    default:
      return t('auth.errors.generic');
  }
};
