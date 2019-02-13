import app from 'firebase/app';
import 'firebase/auth';

class Firebase {
  constructor(config) {
    app.initializeApp(config);
    this.auth = app.auth();
    this.googleProvider = new app.auth.GoogleAuthProvider();
  }

  // email methods
  createUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = () => this.auth.signOut();

  resetPassword = email => this.auth.sendPasswordResetEmail(email);

  updatePassword = password => this.auth.currentUser.updatePassword(password);

  // google login methods
  signInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);
}

export default Firebase;
