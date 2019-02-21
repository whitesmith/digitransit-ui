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
  setUserSettings = settings => {
    console.log('SAVING SETTINGS: ', settings);
    return this.database
      .ref('customizedSettings/' + this.auth.currentUser.uid)
      .set(settings);
  };

  getUserSettings = () => {
    console.log('LOADING SETTINGS...');
    return this.database
      .ref('customizedSettings/' + this.auth.currentUser.uid)
      .once('value');
  };
}

export default Firebase;
