import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

class Firebase {
  constructor(config) {
    app.initializeApp(config);
    this.auth = app.auth();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.database = app.database();
  }

  // email methods
  createUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = () => this.auth.signOut();

  resetPassword = email => this.auth.sendPasswordResetEmail(email);

  updatePassword = password => this.auth.currentUser.updatePassword(password);

  deleteCurrentUser = () => this.auth.currentUser.delete();

  // google login methods
  signInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  // database methods
  setUserSettings = settings =>
    this.database
      .ref('customized-settings/' + this.auth.currentUser.uid)
      .set(settings);

  getUserSettings = () =>
    this.database
      .ref('customized-settings/' + this.auth.currentUser.uid)
      .once('value');

  addUserSearch = newSearch =>
    this.database
      .ref('search-history/' + this.auth.currentUser.uid + '/' + newSearch.searchId)
      .set(newSearch);

  getUserSearchHistory = () =>
    this.database
      .ref('search-history/' + this.auth.currentUser.uid)
      .limitToLast(20)
      .once('value');
}

export default Firebase;
