import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from './Icon';
import { intlShape } from 'react-intl';
import {getStatAmount, getStatAverage } from '../util/statUtils';

const Stat = (props, { config, intl }) => {
  const metricData = getStatAmount(props.amount, props.smallUnit, props.bigUnit);
  const averageData = getStatAverage(props.percentage, props.inverted, intl);

  return (
    <>
      <p className="stat__type">
        { typeof props.icon === 'string' ?
            (<Icon
              className="prefix-icon stat__icon"
              img={`icon-icon_${props.icon}`}
            />)
          :
            props.icon
        }
        <FormattedMessage
          id={props.textId}
          defaultMessage={props.defaultMessage}
        />
      </p>
      {metricData.invalid ? (
        <div>
          <p className="stat__data">
            <span className="stat__value">—</span>
          </p>
        </div>
      ) : (
        <div>
          <p className="stat__data">
            <span className="stat__value">{metricData.amount}</span>
            &nbsp;
            <span className="stat__unit">{metricData.unit}</span>
          </p>
          <p className={`stat__average stat__average--${averageData.class}`}>
            {averageData.percentage}% <small>{averageData.label}</small>
          </p>
        </div>
      )}
    </>
  );
}

Stat.propTypes = {
  icon: PropTypes.any,
  textId: PropTypes.string,
  defaultMessage: PropTypes.string,
  amount: PropTypes.number,
  unit: PropTypes.any,
  percentage: PropTypes.number,
  inverted: PropTypes.bool
};

Stat.contextTypes = {
  config: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

export default Stat