import cx from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import StopCode from './StopCode';
import Icon from './Icon';
import ZoneIcon from './ZoneIcon';

function IntermediateLeg({
  color,
  mode,
  arrivalTime,
  realTime,
  name,
  stopCode,
  focusFunction,
  showCurrentZoneDelimiter,
  showZoneLimits,
  previousZoneId,
  currentZoneId,
  nextZoneId,
  isCanceled,
}) {
  const modeClassName = mode.toLowerCase();
  const isDualZone = currentZoneId && (previousZoneId || nextZoneId);
  const isTripleZone = currentZoneId && previousZoneId && nextZoneId;

  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
  return (
    <div
      style={{ width: '100%' }}
      className={cx(
        'row itinerary-row',
        showZoneLimits && {
          'zone-dual': isDualZone && !isTripleZone,
          'zone-triple': isTripleZone,
          'zone-previous': currentZoneId && previousZoneId,
        },
      )}
      onClick={e => focusFunction(e)}
    >
      {showZoneLimits &&
        currentZoneId && (
          <div className="zone-icons-container">
            {previousZoneId && <ZoneIcon zoneId={previousZoneId} />}
            <ZoneIcon
              zoneId={currentZoneId}
              className={cx({
                'zone-delimiter':
                  showCurrentZoneDelimiter || (previousZoneId && currentZoneId),
              })}
            />
            {nextZoneId && (
              <ZoneIcon zoneId={nextZoneId} className="zone-delimiter" />
            )}
          </div>
        )}
      <div className={`leg-before ${modeClassName}`}>
        <div className={`leg-before-circle circle-fill ${modeClassName}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={28}
            height={28}
            style={{ fill: color, stroke: color }}
          >
            <circle strokeWidth="2" width={28} cx={11} cy={10} r={4} />
          </svg>
        </div>
        <div style={{ color }} className={`leg-before-line ${modeClassName}`} />
      </div>
      <div
        className={`small-9 columns itinerary-instruction-column intermediate ${modeClassName}`}
      >
        <div className="itinerary-leg-first-row">
          <div className="itinerary-intermediate-stop-name">
            <span className={cx({ realtime: realTime })}>
              {realTime && (
                <Icon
                  img="icon-icon_realtime"
                  className="realtime-icon realtime"
                />
              )}
              <span className={cx({ canceled: isCanceled })}>
                {moment(arrivalTime).format('HH:mm')}
              </span>
            </span>
            {` ${name}`} <StopCode code={stopCode} />
          </div>
        </div>
        <div className="itinerary-leg-action" />
      </div>
    </div>
  );
}

IntermediateLeg.propTypes = {
  focusFunction: PropTypes.func.isRequired,
  arrivalTime: PropTypes.number.isRequired,
  realTime: PropTypes.bool,
  name: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  color: PropTypes.string,
  stopCode: PropTypes.string.isRequired,
  showCurrentZoneDelimiter: PropTypes.bool,
  showZoneLimits: PropTypes.bool,
  previousZoneId: PropTypes.string,
  currentZoneId: PropTypes.string,
  nextZoneId: PropTypes.string,
  isCanceled: PropTypes.bool,
};

IntermediateLeg.defaultProps = {
  showCurrentZoneDelimiter: false,
  showZoneLimits: false,
  previousZoneId: undefined,
  currentZoneId: undefined,
  nextZoneId: undefined,
  isCanceled: false,
};

export default IntermediateLeg;
