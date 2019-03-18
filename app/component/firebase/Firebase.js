import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import moment from 'moment';

export const PAGE_MODE_FIRST = 'page_mode_first';
export const PAGE_MODE_NEXT = 'page_mode_next';
export const PAGE_MODE_PREVIOUS = 'page_mode_previous';
export const PAGE_MODE_ALL = 'page_mode_all';

const QUERY_LIMIT = 10;

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

  downloadUserData = () =>
    Promise.all([
      this.getUserSearchHistory(PAGE_MODE_ALL),
      this.getUserLocations(),
      this.getUserFavorites(),
      this.getUserLanguage(),
      this.getUserSettings(),
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
      .ref(
        'search-history/' +
          this.auth.currentUser.uid +
          '/' +
          newSearch.searchId,
      )
      .set({ ...newSearch, timestamp: moment().unix() });

  deleteUserSearch = searchId =>
    this.database
      .ref('search-history/' + this.auth.currentUser.uid + '/' + searchId)
      .remove();

  getUserSearchHistory = mode => {
    // getting one more element to be our cursor for the next page
    const queryLimit = QUERY_LIMIT + 1;

    const baseQuery = this.database
      .ref('search-history/' + this.auth.currentUser.uid)
      .orderByChild('timestamp');

    let query = null;

    //using the correct cursor depending on the page wanted
    switch (mode) {
      case PAGE_MODE_NEXT:
        query = baseQuery.endAt(this.nextQueryCursor).limitToLast(queryLimit);
        break;
      case PAGE_MODE_PREVIOUS:
        query = baseQuery
          .startAt(this.prevQueryCursor)
          .limitToFirst(queryLimit);
        break;
      case PAGE_MODE_ALL:
        query = baseQuery;
        break;
      default:
        query = baseQuery.limitToLast(queryLimit);
        break;
    }

    return query.once('value').then(snap => {
      //filterd snapshots will contain the results except the NEXT cursor
      const filteredSnap = [];
      const nSearches = snap.numChildren();
      if (nSearches > 0) {
        let idx = 0;
        let firstSearchResult = null;
        let lastSearchResult = null;
        let reachedFirstResult = false;
        //foreach will ensure the correct order of the query results
        snap.forEach(s => {
          const snapValue = s.val();
          //if there is just one result, only option is to go back
          if (nSearches === 1) {
            firstSearchResult = lastSearchResult = snapValue;
          } else {
            if (idx === 0) {
              //save the first element to set the cursor later
              firstSearchResult = snapValue;
            } else {
              //skipping the cursor
              if (mode == PAGE_MODE_FIRST) {
                //if this is the first page we need to store the first element
                this.firstSearchCursor = snapValue.timestamp;
              }
              //first page reached when going back on pages
              reachedFirstResult =
                this.firstSearchCursor === snapValue.timestamp;
              if (idx === nSearches - 1) {
                //save the last element to set the cursor later
                lastSearchResult = snapValue;
              }
              filteredSnap.push(s);
            }
          }
          idx += 1;
        });
        // first element used as NEXT cursor if there are more pages to see
        this.nextQueryCursor =
          nSearches <= QUERY_LIMIT || firstSearchResult == null
            ? null
            : firstSearchResult.timestamp;
        // last element used as PREVIOUS cursor if there are more pages to go back to
        this.prevQueryCursor =
          reachedFirstResult || lastSearchResult == null
            ? null
            : lastSearchResult.timestamp;
      }
      return Promise.resolve(filteredSnap);
    });
  };

  setUserLanguage = language =>
    this.database.ref('language/' + this.auth.currentUser.uid).set(language);

  getUserLanguage = () =>
    this.database.ref('language/' + this.auth.currentUser.uid).once('value');

  addUserLocation = location =>
    this.database
      .ref(
        'locations/' + this.auth.currentUser.uid + '/' + location.properties.id,
      )
      .set({ ...location, timestamp: moment().unix() });

  getUserLocations = () =>
    this.database
      .ref('locations/' + this.auth.currentUser.uid)
      .orderByChild('timestamp')
      .limitToLast(QUERY_LIMIT)
      .once('value');

  setUserFavorite = favorite => {
    const timestamp = moment().unix();
    if (favorite.id == null) {
      favorite.id = `${timestamp}${favorite.lat}${favorite.lon}`
        .split('.')
        .join('');
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

  getAverages = () => Promise.all([
    this.database
      .ref('averages/' + this.auth.currentUser.uid)
      .once('value'),
    this.database
      .ref('averages/global')
      .once('value')
  ])

  getMonthlyAverages = () => 
    this.database
      .ref('monthly-averages/' + this.auth.currentUser.uid)
      .once('value')
}

export default Firebase;
