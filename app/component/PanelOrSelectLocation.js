import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import OriginSelector from './OriginSelector';
import OriginSelectorWithFirebase from './OriginSelectorWithFirebase';
import { dtLocationShape } from '../util/shapes';
import { withAuthentication } from './session';

const PanelOrSelectLocation = ({ panel, panelctx, authUser, firebase }) => {
  if (panelctx.origin.ready) {
    return React.createElement(panel, panelctx);
  }

  return (
    <div className="frontpage-panel">
      <div id="nolocation-panel" key="contents" className="flex-vertical">
        <p>
          <FormattedMessage
            id="splash-choose"
            defaultMessage="Select your origin"
          />
        </p>
        {authUser == null ?
          <OriginSelector
            origin={panelctx.origin}
            destination={panelctx.destination}
            tab={panelctx.tab}
          /> :
          <OriginSelectorWithFirebase
            origin={panelctx.origin}
            destination={panelctx.destination}
            tab={panelctx.tab}
            firebase={firebase}
          />
        }
      </div>
    </div>
  );
};

PanelOrSelectLocation.propTypes = {
  panel: PropTypes.func.isRequired,
  panelctx: PropTypes.shape({
    tab: PropTypes.string.isRequired,
    origin: dtLocationShape,
    destination: dtLocationShape,
  }).isRequired,
  authUser: PropTypes.object,
  firebase: PropTypes.object,
};

export default withAuthentication(PanelOrSelectLocation);
