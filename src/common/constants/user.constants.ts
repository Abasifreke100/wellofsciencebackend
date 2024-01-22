export const USER_CREATED = 'User Created. Check your email to get OTP';
export const STAFF_CREATED = 'Staff Created';
export const STAFF_ACCOUNT_VERIFICATION = 'User account verified successfully';
export const USER_UPDATED = 'User information updated successfully';
export const ADMIN_SEEDER = 'User Seeded Successfully';
export const LOGGED_IN = 'User successfully logged in';
export const LOGGED_OUT = 'Successfully logged out';
export const FORGOT_PWD_RESET = 'Password Created. Login with new password.';
export const PASSWORD_UPDATED =
  'Password updated successfully and should be used on next login.';
export const DATA_FETCH = 'Data fetched successfully';
export const UPDATE_IMAGE = 'Picture changed successfully';
export const REMOVE_IMAGE = 'Picture removed successfully';
export const DELETE_USER = 'User deleted successfully';

export enum RoleEnum {
  STUDENT = 'student',
  MENTOR = 'mentor',
  TRADER = 'trader',
  INVESTOR = 'investor',
  ACCOUNTANT = 'accountant',
  MANAGING_DIRECTOR = 'managing_director',
  ACCOUNT_OFFICER = 'account_officer',
  CUSTOMER_SERVICE = 'customer_service',
  ADMIN = 'admin',
  RISK = 'risk',
}

export enum StatusEnum {
  PENDING = 'PENDING',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}
