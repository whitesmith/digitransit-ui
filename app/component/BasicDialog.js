import PropTypes from 'prop-types';
import React from 'react';

import { FormattedMessage } from 'react-intl';
import Dialog from 'material-ui/Dialog';

const BasicDialog = ({ children, buttons, isOpen, messageId, defaultMessage }) => (
  <Dialog
    actions={buttons.reduce((acc, btn) => [...acc, <span>&nbsp;</span>, btn])}
    modal={false}
    open={isOpen}
  >
    <FormattedMessage id={messageId} defaultMessage={defaultMessage} />
    {children}
  </Dialog>
);

BasicDialog.displayName = 'BasicDialog';

BasicDialog.propTypes = {
  buttons: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  messageId: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string.isRequired,
};

export default BasicDialog;
