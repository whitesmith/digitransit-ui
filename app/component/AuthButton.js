import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withAuthentication } from './session';
import { routerShape } from 'react-router';

const navAuthButton = (id, textId, defaultMessage, executeAction) => (
  <button id={id} className={`navi-button shy-left`} onClick={executeAction}>
    <FormattedMessage id={textId} defaultMessage={defaultMessage} />
  </button>
);

class AuthButton extends React.Component {
  render() {
    const { firebase, authUser } = this.props;
    const { router } = this.context;
    if (authUser) {
      return (
        <>
          {navAuthButton('profile', 'profile', 'Profile', () => {
            router.push('/profile');
          })}
          {navAuthButton('signout', 'sign-out', 'Sign out', () => {
            firebase.signOut().then(() => router.push('/'));
          })}
        </>
      );
    }

    return navAuthButton('signin', 'sign-in', 'Sign in', () => {
      firebase.signInWithGoogle();
    });
  }
}

AuthButton.displayName = 'AuthButton';

AuthButton.propTypes = {
  authUser: PropTypes.object,
  firebase: PropTypes.object,
};

AuthButton.contextTypes = {
  config: PropTypes.object.isRequired,
  router: routerShape.isRequired,
};

export default withAuthentication(AuthButton);
