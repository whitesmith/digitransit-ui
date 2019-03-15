import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { routerShape, Link } from 'react-router';
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
import { getReadMessageIds } from '../store/localStorage';
import BasicDialog from './BasicDialog';

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
    <Icon className="icon" img="icon-icon_arrow-dropdown" />
  </IconButton>
);

class AuthButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { consentAlertIsOpen: false };
  }

  onCancelConsentDialog() {
    this.setState({ consentAlertIsOpen: false });
  }

  onAcceptConsentDialog() {
    this.context.executeAction(markMessageAsRead, 'consent');
    this.setState({ consentAlertIsOpen: false });
    this.loginWithFirebase();
  }

  loginWithFirebase() {
    const { firebase } = this.props;
    const { router, executeAction } = this.context;
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
  }

  render() {
    const { firebase, authUser } = this.props;
    const { router, executeAction, config } = this.context;
    const path = router.location.pathname;

    if (!config.FIREBASE) return null;

    if (authUser && !authUser.isAnonymous) {
      return (
        <IconMenu
          className="navi-menu shy-left"
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          iconButtonElement={AvatarFallback(
            authUser.photoURL,
            authUser.displayName || '',
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

    const consentMsgNotAccepted = !getReadMessageIds().includes('consent');

    return (
      <div>
        {navAuthButton('signin', 'sign-in', 'Sign in', () => {
          if (consentMsgNotAccepted) {
            this.setState({ consentAlertIsOpen: true });
          } else {
            this.loginWithFirebase();
          }
        })}
        {consentMsgNotAccepted && (
          <BasicDialog
            buttons={[
              <button
                key={'cancel'}
                className="button secondary radius"
                onClick={this.onCancelConsentDialog.bind(this)}
              >
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </button>,
              <button
                key={'accept'}
                className="button radius" 
                onClick={this.onAcceptConsentDialog.bind(this)}
              >
                <FormattedMessage id="accept" defaultMessage="Accept" />
              </button>,
            ]}
            isOpen={this.state.consentAlertIsOpen}
            messageId={'consent-confirmation'}
            defaultMessage={'We use cookies to improve our services. Please confirm you agree to its terms and conditions. Read more:'}
          >
            &nbsp;<Link to="terms-and-conditions" target="_blank">
              <FormattedMessage
                id="terms-and-conditions"
                defaultMessage="Terms and Conditions"
              />
            </Link>
            &nbsp;<Link to="privacy-policy" target="_blank">
              <FormattedMessage
                id="privacy-policy"
                defaultMessage="Privacy Policy"
              />
            </Link>
          </BasicDialog>
        )}
      </div>
    );
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
