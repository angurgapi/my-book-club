export interface IAuthData {
  invalidEmail: boolean;
  invalidPassword: boolean;
  wrongPassword: boolean;
  userNotFound: boolean;
}

export interface IRegData extends IAuthData {
  alreadyInUseEmail: boolean;
}
