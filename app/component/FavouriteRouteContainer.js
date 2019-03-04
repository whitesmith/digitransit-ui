import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import Favourite from './Favourite';
import isEmpty from 'lodash/isEmpty';
import { addFavouriteRoute } from '../action/FavouriteActions';
import { withAuthentication } from './session';

class FavouriteRouteContainerBase extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      favourite: props.favourite,
    };
  }

  componentDidUpdate(prevProps) {
    const { firebase, authUser, gtfsId } = this.props;
    if (authUser !== prevProps.authUser && authUser) {
      //check if this favorite is stored in firebase
      firebase.getUserFavorite(gtfsId).then(snap => {
        const fav = snap.val();
        this.setState({
          favourite: !isEmpty(fav)
        });
      });
    }
  }

  manageFavourite = () => {
    const { firebase, gtfsId } = this.props;
    if (this.state.favourite) {
      firebase.deleteUserFavorite(gtfsId).then(
        () => this.setState({ favourite: false })
      )
    } else {
      firebase.setUserFavorite({
        type: 'route',
        id: gtfsId
      }).then(
        () => this.setState({ favourite: true })
      );
    }
  }

  render() {
    const { authUser, favourite, addFavourite } = this.props;
    return (
      <Favourite
        { ...this.props}
        addFavourite={ authUser != null ? this.manageFavourite : addFavourite }
        favourite={ authUser != null ? this.state.favourite : favourite}
      />
    );
  }
}

FavouriteRouteContainerBase.propTypes = {
  authUser: PropTypes.object,
  firebase: PropTypes.object,
};

const FavouriteRouteContainer = connectToStores(
  withAuthentication(FavouriteRouteContainerBase),
  ['FavouriteRoutesStore'],
  (context, { gtfsId }) => ({
    favourite: context.getStore('FavouriteRoutesStore').isFavourite(gtfsId),
    addFavourite: () => context.executeAction(addFavouriteRoute, gtfsId),
  }),
);

FavouriteRouteContainer.contextTypes = {
  getStore: PropTypes.func.isRequired,
  executeAction: PropTypes.func.isRequired,
};

export default FavouriteRouteContainer;
