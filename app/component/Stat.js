import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from './Icon';
import { intlShape } from 'react-intl';

const Stat = (props, { config, intl }) => {
  const labelAboveAverage = intl.formatMessage({
    id: 'above-average',
    defaultMessage: 'above average',
  });
  const labelBelowAverage = intl.formatMessage({
    id: 'below-average',
    defaultMessage: 'below average',
  });
  const averageCompare = 
    (props.percentage > 0) ? labelAboveAverage : labelBelowAverage;
  const averageClass = 
    (props.percentage > 0) ? 
      (props.inverted) ? 'negative' : 'positive'
    : 
      (props.inverted) ? 'positive': 'negative';
    
  const invalidAmount = !props.amount || isNaN(props.amount);

  let decimal = false;
  let unitToShow = '';
  let amountToShow = 0;
  
  if(!invalidAmount) {
    decimal = props.amount > 999;
    unitToShow = decimal ? props.bigUnit : props.smallUnit;
    amountToShow = decimal ? Math.round(props.amount / 10) / 100 : Math.round(props.amount);
  }
  
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
      {invalidAmount ? (
        <div>
          <p className="stat__data">
            <span className="stat__value">—</span>
          </p>
        </div>
      ) : (
        <div>
          <p className="stat__data">
            <span className="stat__value">{amountToShow}</span>
            &nbsp;
            <span className="stat__unit">{unitToShow}</span>
          </p>
          <p className={`stat__average stat__average--${averageClass}`}>
            {Math.abs(props.percentage)}% <small>{averageCompare}</small>
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