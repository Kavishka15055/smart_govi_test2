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
      return t('auth.errors.invalidCredential'); // map to generic invalid credential
    case 'auth/email-already-in-use':
      return t('auth.errors.phoneInUse');
    case 'auth/weak-password':
      return t('auth.errors.weakPassword');
    case 'auth/too-many-requests':
      return t('auth.errors.tooManyRequests');
    default:
      return t('auth.errors.generic');
  }
};
