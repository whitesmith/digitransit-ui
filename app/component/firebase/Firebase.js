import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import moment from 'moment';

export const PAGE_MODE_NEXT = 'page_mode_next';
export const PAGE_MODE_PREVIOUS = 'page_mode_previous';
export const PAGE_MODE_ALL = 'page_mode_all';

class Firebase {
  constructor(config) {
    app.initializeApp(config);
    this.auth = app.auth();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.database = app.database();
    this.prevQueryCursor = null;
    this.nextQueryCursor = null;
    this.firstSearchCursor = null;
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
    this.getUserSearchHistory(PAGE_MODE_ALL),
    this.getUserLocations(),
    this.getUserFavorites(),
    this.getUserLanguage(),
    this.getUserSettings()
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

  getUserSearchHistory = mode => {
    const pageLength = 3;
    const queryLimit = pageLength + 1;

    const baseQuery = this.database
      .ref('search-history/' + this.auth.currentUser.uid)
      .orderByChild('timestamp');

    let query = null;

    switch (mode) {
      case PAGE_MODE_NEXT:
        query = baseQuery.endAt(this.nextQueryCursor).limitToLast(queryLimit);
        break;
      case PAGE_MODE_PREVIOUS:
        query = baseQuery.startAt(this.prevQueryCursor).limitToFirst(queryLimit);
        break;
      case PAGE_MODE_ALL:
        query = baseQuery;
        break;
      default:
        query = baseQuery.limitToLast(queryLimit);
        break;
    }

    return query.once('value').then(snap => {
        const filteredSnap = [];
        const nSearches = snap.numChildren();
        if (nSearches > 0) {
          let idx = 0;

          const onFirstPage = 
            (nSearches <= pageLength && mode === PAGE_MODE_PREVIOUS)
            || mode == null;
          
          const onLastPage = 
            nSearches <= pageLength && mode === PAGE_MODE_NEXT;

          let firstSearchResult = null;
          let lastSearchResult = null;
          let reachedFirstResult = false

          snap.forEach(s => {
            const snapValue = s.val();
            if (idx === 0) {
              firstSearchResult = snapValue;
            } else if (idx === nSearches - 1) {
              lastSearchResult = snapValue ;
            }
            if(idx !== 0) {
              if (mode == null) {
                this.firstSearchCursor = snapValue.timestamp;
              }
      
              if (this.firstSearchCursor === snapValue.timestamp) {
                reachedFirstResult = true;
              }              
              filteredSnap.push(s);
            }
            idx += 1;
          });

          this.nextQueryCursor = onLastPage ? null : firstSearchResult.timestamp;
          this.prevQueryCursor = ( onFirstPage || reachedFirstResult) ? null : lastSearchResult.timestamp;
          
           //if the first result comes on the query just reset the pagination
            // if (this.firstSearchCursor === timestamp && !lastItem ) {
            //   this.prevQueryCursor = null;
            //   this.nextQueryCursor = null;
            //   this.firstSearchCursor = null;
            //   return this.getUserSearchHistory();
            // }
        }
        return Promise.resolve(filteredSnap);
      });
  }
    
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
