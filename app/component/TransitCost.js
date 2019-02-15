import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

function TransitCost(props) {
  if(!props.transitCost) return null;

  const transitCost = `${parseInt(props.transitCost, 10)}€`;

  return (
    <span className={cx(props.className)} style={{ whiteSpace: 'nowrap' }}>
      <span className="walk-calories">&nbsp;≈{transitCost}</span>
    </span>
  );
}

TransitCost.propTypes = {
  transitCost: PropTypes.number.isRequired,
  className: PropTypes.string,
};

TransitCost.displayName = 'TransitCost';
export default TransitCost;
