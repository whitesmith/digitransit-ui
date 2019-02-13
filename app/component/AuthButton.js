import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { withAuthentication } from './session';
import { routerShape } from 'react-router';

const navAuthButton = (id, textId, defaultMessage, executeAction) => (
  <button id={id} className={`navi-button shy-left`} onClick={executeAction}>
    <FormattedMessage id={textId} defaultMessage={defaultMessage} />
  </button>
);

class AuthButtonBase extends Component {
  render() {
    const { firebase, authUser } = this.props;
    const { router } = this.context;
    if (authUser) {
      return (
        <>
          {
            navAuthButton('profile', 'profile', 'Profile', () => {
              router.push('/profile')
            })
          }
          {
            navAuthButton('signout', 'sign-out', 'Sign out', () => {
              firebase.signOut();
            })
          }
        </>
      )
    }

    return navAuthButton('signin', 'sign-in', 'Sign in', () => {
      firebase.signInWithGoogle();
    });
  }
}

AuthButtonBase.displayName = 'AuthButton';

AuthButtonBase.propTypes = {
  authUser: PropTypes.object,
  firebase: PropTypes.object,
};

AuthButtonBase.contextTypes = {
  config: PropTypes.object.isRequired,
  router: routerShape.isRequired,
};

const AuthButton = withAuthentication(AuthButtonBase);

export default AuthButton;
