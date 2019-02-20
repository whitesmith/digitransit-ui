import PropTypes from 'prop-types';
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { routerShape } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { withAuthentication } from './session';
import Dialog from 'material-ui/Dialog';

const userDetails = (name, email, avatar) => (
  <div className="media media--middle padding-vertical-normal">
    <div className="media__figure small-2 large-1">
      <img src={avatar} alt="Profile image" className="profile__img" />
    </div>
    <div className="media__body">
      <h4 className="profile__name">{name}</h4>
      <h5 className="profile__email">{email}</h5>
    </div>
  </div>
);

class ProfilePage extends React.Component {
  state = {
    deleteConfirmationIsOpen: false,
  };

  openDeleteConfirmation = () => {
    this.setState({deleteConfirmationIsOpen: true});
  };

  closeDeleteConfirmation = () => {
    this.setState({deleteConfirmationIsOpen: false});
  };

  downloadData = () => {};

  deleteAccount = () =>
    this.props.firebase.deleteCurrentUser().then(() => {
      this.context.router.push('/');
    });

  render() {
    const { authUser } = this.props;

    return (
      <div className="page-frame fullscreen momentum-scroll profile">
        <div className="profile__banner">
          <div className="row">
            <div className="columns large-8 large-centered">
              <h1 className="profile__heading">
                <FormattedMessage id="profile" defaultMessage="Profile" />
              </h1>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="columns large-8 large-centered">
            {authUser &&
              userDetails(
                authUser.displayName,
                authUser.email,
                authUser.photoURL,
              )}
            <div className="row small-uncollapse padding-vertical-normal">
              <div className="small-12 large-6 columns">
                <button
                  className="button secondary expand"
                  onClick={this.downloadData}
                >
                  <FormattedMessage
                    id="download-personal-data"
                    defaultMessage="Download personal data"
                  />
                </button>
              </div>
              <div className="small-12 large-6 columns">
                <button 
                  className="button info expand"
                  onClick={this.openDeleteConfirmation}
                >
                  <FormattedMessage
                    id="delete-account"
                    defaultMessage="Delete account"
                  />
                </button>
              </div>
              
              <Dialog
                actions={[
                  <button 
                  className="button secondary"
                  onClick={this.closeDeleteConfirmation}
                  >
                    <FormattedMessage
                      id="cancel"
                      defaultMessage="Cancel"
                    />
                  </button>,
                  <span>&nbsp;</span>,
                  <button 
                  className="button alert"
                  onClick={this.deleteAccount}
                  >
                    <FormattedMessage
                      id="delete-account"
                      defaultMessage="Delete account"
                    />
                  </button>
                ]}
                modal={false}
                open={this.state.deleteConfirmationIsOpen}
                onRequestClose={this.closeDeleteConfirmation}
              >
                <FormattedMessage
                  id="delete-account-confirmation"
                  defaultMessage="Are you sure you want to delete your account?"
                />
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  authUser: PropTypes.object,
  firebase: PropTypes.object,
};

ProfilePage.contextTypes = {
  config: PropTypes.object.isRequired,
  router: routerShape.isRequired,
};

export default withAuthentication(ProfilePage);
