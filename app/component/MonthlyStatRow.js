import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import {getStatAmount, getStatAverage, calcPercentageDiff } from '../util/statUtils';

const MonthlyStatRow = ({ stat }, { intl }) => {

  const metricData = {
    carEmissions: getStatAmount(
      stat.co2Sum, 
      (<>gCO<sub>2</sub></>), 
      (<>kgCO<sub>2</sub></>)
    ),
    publicTransport: getStatAmount(
      stat.publicTransportationSum, "m", "km"
    ),
    walkingDistance: getStatAmount(
      stat.walkDistanceSum, "m", "km"
    ),
    caloriesWalked: getStatAmount(
      stat.caloriesSum, "cal", "kcal"
    )
  }

  const averageData = {
    carEmissions: getStatAverage(
      calcPercentageDiff(stat.co2Sum, stat.co2Avg), 
      true, intl
    ),
    publicTransport: getStatAverage(
      calcPercentageDiff(
        stat.publicTransportationSum, 
        stat.publicTransportationAvg
      ),
      false, intl
    ),
    walkingDistance: getStatAverage(
      calcPercentageDiff(stat.walkDistanceSum, stat.walkDistanceAvg),
      false, intl
    ),
    caloriesWalked: getStatAverage(
      calcPercentageDiff(stat.caloriesSum, stat.caloriesAvg),
      false, intl
    )
  }

  return (
    <tr
      className="next-departure-row-tr monthly-history-row"
      style={{ cursor: 'pointer' }}
    >
      <td className="td-destination">
        <span>
          {stat.month}
        </span>
      </td>
      <td className="td-destination">
        <p>
          {metricData.carEmissions.amount} {metricData.carEmissions.unit}
          <br/>
          <small className={`stat__average stat__average--${averageData.carEmissions.class}`}>
          {averageData.carEmissions.percentage}% {averageData.carEmissions.label}
          </small>
        </p>
      </td>
      <td className="td-destination">
        <p>
          {metricData.publicTransport.amount} {metricData.publicTransport.unit}
          <br/>
          <small className={`stat__average stat__average--${averageData.publicTransport.class}`}>
          {averageData.publicTransport.percentage}% {averageData.publicTransport.label}
          </small>
        </p>
      </td>
      <td className="td-destination">
        <p>
          {metricData.walkingDistance.amount} {metricData.walkingDistance.unit}
          <br/>
          <small className={`stat__average stat__average--${averageData.walkingDistance.class}`}>
          {averageData.walkingDistance.percentage}% {averageData.walkingDistance.label}
          </small>
        </p>
      </td>
      <td className="td-destination">
        <p>
          {metricData.caloriesWalked.amount} {metricData.caloriesWalked.unit}
          <br/>
          <small className={`stat__average stat__average--${averageData.caloriesWalked.class}`}>
          {averageData.caloriesWalked.percentage}% {averageData.caloriesWalked.label}
          </small>
        </p>
      </td>
    </tr>
  );
};

MonthlyStatRow.propTypes = {
  stat: PropTypes.object.isRequired,
};

MonthlyStatRow.contextTypes = {
  intl: intlShape.isRequired,
};

export default MonthlyStatRow;
