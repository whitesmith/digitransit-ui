import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import moment from 'moment';

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

  downloadUserData = () => Promise.all([
    this.getUserSearchHistory(),
    this.getUserLocations(),
    this.getUserFavorites()
  ]);

  // google login methods
  signInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  // anonymous login methods
  signInAnonymously = () => this.auth.signInAnonymously();

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
      .set({ ...newSearch, timestamp: moment().unix() });

  getUserSearchHistory = () =>
    this.database
      .ref('search-history/' + this.auth.currentUser.uid)
      .orderByChild('timestamp')
      .limitToLast(20)
      .once('value');

  setUserLanguage = language =>
    this.database
      .ref('language/' + this.auth.currentUser.uid)
      .set(language);

  getUserLanguage = () =>
    this.database
      .ref('language/' + this.auth.currentUser.uid)
      .once('value');

  addUserLocation = location =>
    this.database
      .ref('locations/' + this.auth.currentUser.uid + '/' + location.properties.id)
      .set({ ...location, timestamp: moment().unix() });

  getUserLocations = () =>
    this.database
      .ref('locations/' + this.auth.currentUser.uid)
      .orderByChild('timestamp')
      .limitToLast(10)
      .once('value');

  setUserFavorite = favorite => {
    const timestamp = moment().unix();
    if (favorite.id == null) {
      favorite.id = `${timestamp}${favorite.lat}${favorite.lon}`.split('.').join('');
    }
    return this.database
      .ref('favorites/' + this.auth.currentUser.uid + '/' + favorite.id)
      .set({ ...favorite, timestamp });
  };

  getUserFavorites = () =>
    this.database
      .ref('favorites/' + this.auth.currentUser.uid)
      .orderByChild('timestamp')
      .once('value');

  getUserFavorite = favoriteId =>
    this.database
      .ref('favorites/' + this.auth.currentUser.uid + '/' + favoriteId)
      .once('value');

  deleteUserFavorite = favoriteId =>
    this.database
      .ref('favorites/' + this.auth.currentUser.uid + '/' + favoriteId)
      .remove();
}

export default Firebase;
