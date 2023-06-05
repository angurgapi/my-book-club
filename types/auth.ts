export interface IAuthData {
  invalidEmail: boolean;
  invalidPassword: boolean;
  wrongPassword: boolean;
  userNotFound: boolean;
  alreadyInUseEmail: boolean;
}

// export interface IRegData extends IAuthData {
//   alreadyInUseEmail: boolean;
// }
