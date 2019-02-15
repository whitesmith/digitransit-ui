import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

function CO2Emissions(props) {
  if(!props.co2Emissions) return null;

  const CO2Emissions = parseInt(props.co2Emissions, 10);

  return (
    <span className={cx(props.className)} style={{ whiteSpace: 'nowrap' }}>
      <span className="co2-emissions">≈{CO2Emissions}kgCO<sub>2</sub></span>
    </span>
  );
}

CO2Emissions.propTypes = {
  co2Emissions: PropTypes.number.isRequired,
  className: PropTypes.string,
};

CO2Emissions.displayName = 'CO2Emissions';
export default CO2Emissions;
