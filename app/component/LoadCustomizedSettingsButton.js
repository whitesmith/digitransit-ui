import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import Snackbar from 'material-ui/Snackbar';
import PropTypes from 'prop-types';
import React from 'react';

import { routerShape } from 'react-router';
import { FormattedMessage } from 'react-intl';

import { getCustomizedSettings } from '../store/localStorage';
import { getDefaultSettings } from '../util/planParamUtil';
import { getDrawerWidth } from '../util/browser';
import SecondaryButton from './SecondaryButton';

class LoadCustomizedSettingsButton extends React.Component {
  static propTypes = {
    noSettingsFound: PropTypes.func.isRequired,
  };

  static contextTypes = {
    config: PropTypes.object.isRequired,
    piwik: PropTypes.object,
    router: routerShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      autoHideDuration: 940,
      open: false,
    };
  }

  loadSettingsData = () => {
    if (this.context.piwik != null) {
      this.context.piwik.trackEvent(
        'ItinerarySettings',
        'SettingsPanelloadSettingsButton',
        'loadSettings',
      );
    }

    // const querySettings = getQuerySettings(this.context.location.query);
    const defaultSettings = getDefaultSettings(this.context.config);
    const { firebase } = this.props;
    if (firebase.auth.currentUser) {
      firebase.getUserSettings().then(snap => {
        const settings = snap.val();
        this.handleLoadedSettings(settings, defaultSettings);
      });
    } else {
      const getSettings = getCustomizedSettings();
      this.handleLoadedSettings(getSettings, defaultSettings);
    }
  };

  handleLoadedSettings = (settings, defaultSettings) => {
    if (isEmpty(settings) || isEqual(settings, defaultSettings)) {
      this.props.noSettingsFound();
    } else {
      // getCustomizedSettings(querySettings);
      this.context.router.replace({
        ...this.context.router.location,
        query: {
          ...settings,
        },
      });
      this.setState({
        open: true,
      });
    }
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const drawerWidth = getDrawerWidth(window);
    return (
      <React.Fragment>
        <div className="load-settings">
          <SecondaryButton
            ariaLabel="settings-loadbutton"
            buttonName="settings-loadbutton"
            buttonClickAction={() => this.loadSettingsData()}
          />
        </div>
        <Snackbar
          aria-hidden
          open={this.state.open}
          message={
            <FormattedMessage
              tagName="span"
              defaultMessage="Settings loaded"
              id="settings-loaded"
            />
          }
          autoHideDuration={this.state.autoHideDuration}
          onRequestClose={this.handleRequestClose}
          style={{ width: drawerWidth }}
          bodyStyle={{
            backgroundColor: '#585a5b',
            color: '#fff',
            fontSize: '0.8rem',
            fontFamily:
              '"Gotham Rounded SSm A", "Gotham Rounded SSm B", Arial, Georgia, Serif',
            maxWidth: drawerWidth,
            textAlign: 'center',
            width: '100%',
          }}
        />
      </React.Fragment>
    );
  }
}

export default LoadCustomizedSettingsButton;
