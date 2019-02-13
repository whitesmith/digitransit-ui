import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const currentUser = false;

const navAuthButton = (id, textId, defaultMessage, executeAction) => (
  <button
    id={id}
    className={`navi-button shy-left`}
    onClick={executeAction}
  >
    <FormattedMessage id={textId} defaultMessage={defaultMessage} />
  </button>
);

const AuthButton = ({}, { config }) => {
  if(!config.userAuthentication) return null;

  if (currentUser) {
    return navAuthButton("signout", "sign-out", "Sign out", () => {
      console.log("firebase.auth().signOut") 
    });
  } else {
    return navAuthButton("signin", "sign-in", "Sign in", () => {
      console.log("firebase.auth().signInWithRedirect") 
    });
  }
};

AuthButton.displayName = 'AuthButton';

AuthButton.propTypes = { };

AuthButton.contextTypes = {
  config: PropTypes.object.isRequired,
};

export default AuthButton;
