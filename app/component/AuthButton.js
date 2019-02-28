import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { routerShape } from 'react-router';
import isEmpty from 'lodash/isEmpty';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Icon from './Icon';
import MenuItem from 'material-ui/MenuItem';
import { markMessageAsRead } from '../action/MessageActions';
import { setLanguage } from '../action/userPreferencesActions';
import { getDefaultSettings } from '../util/planParamUtil';
import { clearQueryParams } from '../util/queryUtils';
import { withAuthentication } from './session';

const resetStyle = { color: '', background: 'unset', fontSize: '' };
const initials = name =>
  name.split(' ').reduce((r, w) => (r += w.slice(0, 1)), '');

const navAuthButton = (id, textId, defaultMessage, executeAction) => (
  <button id={id} className={`navi-button shy-left`} onClick={executeAction}>
    <FormattedMessage id={textId} defaultMessage={defaultMessage} />
  </button>
);

const navMenuButton = (id, textId, defaultMessage, active, executeAction) => (
  <MenuItem
    id={id}
    style={resetStyle}
    className={`navi-menu__item ${active ? 'active' : ''}`}
    onClick={executeAction}
  >
    <FormattedMessage id={textId} defaultMessage={defaultMessage} />
  </MenuItem>
);

const AvatarFallback = (url, name) => (
  <IconButton className="navi-menu__avatar-container">
    <Avatar
      style={resetStyle}
      className="navi-menu__avatar"
      alt={initials(name)}
      src={url ? url : null}
    >
      {url ? null : initials(name)}
    </Avatar>
    <Icon
      className="icon"
      img="icon-icon_arrow-dropdown"
    />
  </IconButton>
);

class AuthButton extends React.Component {
  render() {
    const { firebase, authUser } = this.props;
    const { router, executeAction, config } = this.context;
    const path = router.location.pathname;

    if(!config.FIREBASE) return null;

    if (authUser) {
      return (
        <IconMenu
          className="navi-menu shy-left"
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          iconButtonElement={AvatarFallback(
            authUser.photoURL,
            authUser.displayName,
          )}
        >
          {navMenuButton(
            'account-history',
            'account-history',
            'Account history',
            path === '/account-history',
            () => {
              router.push('/account-history');
            },
          )}
          {navMenuButton(
            'profile',
            'profile',
            'Profile',
            path === '/profile',
            () => {
              router.push('/profile');
            },
          )}
          {navMenuButton('signout', 'sign-out', 'Sign out', false, () => {
            firebase.signOut().then(() => {
              router.push('/');
              executeAction(markMessageAsRead, 'account');
              clearQueryParams(router, Object.keys(getDefaultSettings(config)));
            });
          })}
        </IconMenu>
      );
    }

    return navAuthButton('signin', 'sign-in', 'Sign in', () => {
      firebase.signInWithGoogle().then(() => {
        executeAction(markMessageAsRead, 'account');
        firebase.getUserLanguage().then(snap => {
          const language = snap.val();
          if (language) {
            executeAction(setLanguage, language);
          }
        });
        firebase.getUserSettings().then(snap => {
          const settings = snap.val();
          if (!isEmpty(settings)) {
            router.replace({
              ...router.location,
              query: { ...settings },
            });
          }
        });
      });
    });
  }
}

AuthButton.displayName = 'AuthButton';

AuthButton.propTypes = {
  authUser: PropTypes.object,
  firebase: PropTypes.object,
};

AuthButton.contextTypes = {
  executeAction: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
  router: routerShape.isRequired,
};

export default withAuthentication(AuthButton);
