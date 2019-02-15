import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

function WalkCalories(props) {
  if(!props.walkCalories) return null;

  const roundedWalkCalories = parseInt(props.walkCalories, 10);
  const roundedWalkCaloriesInK = (roundedWalkCalories / 1000).toFixed(1);

  const walkCalories =
    roundedWalkCalories < 1000
      ? `${roundedWalkCalories}cal`
      : `${roundedWalkCaloriesInK}kcal`;

  return (
    <span className={cx(props.className)} style={{ whiteSpace: 'nowrap' }}>
      <span className="walk-calories">&nbsp;≈{walkCalories}</span>
    </span>
  );
}

WalkCalories.propTypes = {
  walkCalories: PropTypes.number.isRequired,
  className: PropTypes.string,
};

WalkCalories.displayName = 'WalkCalories';
export default WalkCalories;
