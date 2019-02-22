import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

function CO2Emissions(props) {
  if(!props.co2Emissions) return null;

  const roundedCO2EmissionsInG = Math.round(props.co2Emissions / 10) * 10;
  const roundedCO2EmissionsInKg = (roundedCO2EmissionsInG / 1000).toFixed(1);

  const CO2Emissions =
    roundedCO2EmissionsInG < 1000
      ? `${roundedCO2EmissionsInG}g`
      : `${roundedCO2EmissionsInKg}kg`;

  return (
    <span className={cx(props.className)} style={{ whiteSpace: 'nowrap' }}>
      <span className="co2-emissions">≈{CO2Emissions}CO<sub>2</sub></span>
    </span>
  );
}

CO2Emissions.propTypes = {
  co2Emissions: PropTypes.number.isRequired,
  className: PropTypes.string,
};

CO2Emissions.displayName = 'CO2Emissions';
export default CO2Emissions;
