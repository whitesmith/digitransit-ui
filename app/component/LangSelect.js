import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import ComponentUsageExample from './ComponentUsageExample';
import { setLanguage } from '../action/userPreferencesActions';
import { isBrowser } from '../util/browser';
import { withAuthentication } from './session';

const selectLanguage = (executeAction, lang, firebase) => () => {
  executeAction(setLanguage, lang);
  if (firebase) {
    firebase.setUserLanguage(lang);
  }
};

const language = (lang, currentLanguage, highlight, executeAction, firebase) => (
  <button
    id={`lang-${lang}`}
    key={lang}
    className={`${(highlight && 'selected') || ''} noborder lang`}
    onClick={selectLanguage(executeAction, lang, firebase)}
  >
    {lang}
  </button>
);

const LangSelect = ({ currentLanguage, firebase, authUser }, { executeAction, config}) => {
  if (isBrowser) {
    return (
      <div key="lang-select" id="lang-select">
        {config.availableLanguages.map(lang =>
          language(
            lang,
            currentLanguage,
            lang === currentLanguage,
            executeAction,
            authUser != null ? firebase : null,
          ),
        )}
      </div>
    );
  }
  return null;
};

LangSelect.displayName = 'LangSelect';

LangSelect.description = () => (
  <div>
    <p>Language selection component, language selection comes from config.</p>
    <ComponentUsageExample description="">
      <div style={{ width: '200px', background: 'rgb(51, 51, 51)' }}>
        <LangSelect currentLanguage="en" />
      </div>
    </ComponentUsageExample>
  </div>
);

LangSelect.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
  firebase: PropTypes.object,
  authUser: PropTypes.object,
};

LangSelect.contextTypes = {
  executeAction: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
};

const connected = withAuthentication(connectToStores(
  LangSelect,
  ['PreferencesStore'],
  context => ({
    currentLanguage: context.getStore('PreferencesStore').getLanguage(),
  }),
));

export { connected as default, LangSelect as Component };
