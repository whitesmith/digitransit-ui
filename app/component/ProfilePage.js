import PropTypes from 'prop-types';
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { routerShape } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { withAuthentication } from './session';
import { addMessage } from '../action/MessageActions';
import BasicDialog from './BasicDialog';

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
  constructor(props) {
    super(props);
    this.state = { deleteConfirmationIsOpen: false };
  }

  openDeleteConfirmation = () => {
    this.setState({ deleteConfirmationIsOpen: true });
  };

  closeDeleteConfirmation = () => {
    this.setState({ deleteConfirmationIsOpen: false });
  };

  downloadData = () => {};

  deleteAccount = () =>
    this.props.firebase
      .deleteCurrentUser()
      .then(() => {
        this.context.router.push('/');
        this.context.executeAction(addMessage, {
          id: 'account',
          persistence: 'repeat',
          content: {
            en: [{ type: 'text', content: 'Account deleted successfully.' }],
          },
        });
      })
      .catch(error => {
        if (error.code === 'auth/requires-recent-login') {
          this.closeDeleteConfirmation();
          this.context.executeAction(addMessage, {
            id: 'account',
            persistence: 'repeat',

            content: {
              en: [
                {
                  type: 'text',
                  content:
                    'This operation is sensitive and requires recent authentication. Log in again before retrying this request.',
                },
              ],
            },
          });
        }
      });

  render() {
    const { authUser } = this.props;
    const { deleteConfirmationIsOpen } = this.state;

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
                  className="button radius expand"
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
                  className="button secondary radius expand"
                  onClick={this.openDeleteConfirmation}
                >
                  <FormattedMessage
                    id="delete-account"
                    defaultMessage="Delete account"
                  />
                </button>
              </div>

              <BasicDialog
                buttons={[
                  <button
                    className="button secondary radius"
                    onClick={this.closeDeleteConfirmation}
                  >
                    <FormattedMessage id="cancel" defaultMessage="Cancel" />
                  </button>,
                  <button
                    className="button alert radius"
                    onClick={this.deleteAccount}
                  >
                    <FormattedMessage
                      id="delete-account"
                      defaultMessage="Delete account"
                    />
                  </button>,
                ]}
                isOpen={deleteConfirmationIsOpen}
                messageId={'delete-account-confirmation'}
                defaultMessage={'Are you sure you want to delete your account?'}
              />
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
  executeAction: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  router: routerShape.isRequired,
};

export default withAuthentication(ProfilePage);
