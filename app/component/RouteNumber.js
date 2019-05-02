import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { intlShape } from 'react-intl';
import IconWithBigCaution from './IconWithBigCaution';
import IconWithIcon from './IconWithIcon';
import ComponentUsageExample from './ComponentUsageExample';
import { realtimeDeparture as exampleRealtimeDeparture } from './ExampleData';

const LONG_ROUTE_NUMBER_LENGTH = 6;

function RouteNumber(props, context) {
  let mode = props.mode.toLowerCase();
  const { color } = props;

  if (mode === 'bicycle' || mode === 'car') {
    mode += '-withoutBox';
  }

  const longText = props.text && props.text.length >= LONG_ROUTE_NUMBER_LENGTH;

  const icon = (isCallAgency, hasDisruption, badgeFill, badgeText) => {
    if (isCallAgency) {
      return (
        <IconWithIcon
          color={color}
          className={`${mode} call`}
          img={`icon-icon_${mode}`}
          subIcon="icon-icon_call"
          title={props.text}
        />
      );
    }

    if (hasDisruption) {
      return (
        <IconWithBigCaution
          color={color}
          className={mode}
          img={`icon-icon_${mode}`}
          title={props.text}
        />
      );
    }

    return (
      <IconWithIcon
        badgeFill={badgeFill}
        badgeText={badgeText}
        color={color}
        className={mode}
        img={`icon-icon_${mode}`}
        subIcon=""
        title={props.text}
      />
    );
  };

  // props.vertical is FALSE in Near you view
  // props.vertical is TRUE in itinerary view
  return (
    <span
      className={cx('route-number', {
        'overflow-fade': longText && props.fadeLong,
        vertical: props.vertical,
      })}
    >
      <span
        className={cx('vcenter-children', props.className)}
        aria-label={context.intl.formatMessage({
          id: mode,
          defaultMessage: 'Vehicle',
        })}
        role="img"
      >
        {props.vertical === true ? (
          <div className={`special-icon ${mode}`}>
            {icon(
              props.isCallAgency,
              props.hasDisruption,
              props.badgeFill,
              props.badgeText,
            )}
          </div>
        ) : (
          icon(props.isCallAgency, props.hasDisruption)
        )}
        {props.withBar && (
          <div className="bar-container">
            <div
              style={{
                color: mode === 'call' ? 'white' : color || 'currentColor',
              }}
              className={cx('bar', mode)}
            >
              <div className="bar-inner" />
            </div>
          </div>
        )}
      </span>
      {props.text &&
        (props.vertical === false ? (
          <span
            style={{ color: props.color ? props.color : null }}
            className={cx('vehicle-number', mode, {
              'overflow-fade': longText && props.fadeLong,
              long: longText,
            })}
          >
            {props.text}
          </span>
        ) : (
          <div className="vehicle-number-container-v">
            <span
              style={{ color: props.color ? props.color : null }}
              className={cx('vehicle-number', mode, {
                'overflow-fade': longText && props.fadeLong,
                long: longText,
              })}
            >
              {props.text}
            </span>
          </div>
        ))}
    </span>
  );
}

RouteNumber.description = () => (
  <div>
    <p>Display mode icon and route number with mode color</p>
    <ComponentUsageExample>
      <RouteNumber
        mode={exampleRealtimeDeparture.pattern.route.mode}
        text={exampleRealtimeDeparture.pattern.route.shortName}
      />
    </ComponentUsageExample>
    <ComponentUsageExample description="with disruption">
      <div style={{ paddingLeft: '5px' }}>
        <RouteNumber
          mode={exampleRealtimeDeparture.pattern.route.mode}
          text={exampleRealtimeDeparture.pattern.route.shortName}
          hasDisruption
        />
      </div>
    </ComponentUsageExample>
    <ComponentUsageExample description="with callAgency">
      <div style={{ paddingLeft: '5px' }}>
        <RouteNumber
          mode={exampleRealtimeDeparture.pattern.route.mode}
          text={exampleRealtimeDeparture.pattern.route.shortName}
          isCallAgency
        />
      </div>
    </ComponentUsageExample>
    <ComponentUsageExample description="in vertical configuration">
      <RouteNumber
        mode={exampleRealtimeDeparture.pattern.route.mode}
        text={exampleRealtimeDeparture.pattern.route.shortName}
        vertical
      />
    </ComponentUsageExample>
    <ComponentUsageExample description="in vertical configuration with disruption">
      <div style={{ paddingLeft: '5px' }}>
        <RouteNumber
          mode={exampleRealtimeDeparture.pattern.route.mode}
          text={exampleRealtimeDeparture.pattern.route.shortName}
          hasDisruption
          vertical
        />
      </div>
    </ComponentUsageExample>
    <ComponentUsageExample description="in vertical configuration with callAgency">
      <div style={{ paddingLeft: '5px' }}>
        <RouteNumber
          mode={exampleRealtimeDeparture.pattern.route.mode}
          text={exampleRealtimeDeparture.pattern.route.shortName}
          isCallAgency
          vertical
        />
      </div>
    </ComponentUsageExample>
  </div>
);

RouteNumber.propTypes = {
  mode: PropTypes.string.isRequired,
  color: PropTypes.string,
  text: PropTypes.node,
  vertical: PropTypes.bool,
  className: PropTypes.string,
  hasDisruption: PropTypes.bool,
  fadeLong: PropTypes.bool,
  withBar: PropTypes.bool,
  isCallAgency: PropTypes.bool,
  badgeFill: PropTypes.string,
  badgeText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

RouteNumber.defaultProps = {
  badgeFill: undefined,
  badgeText: undefined,
  className: '',
  vertical: false,
  hasDisruption: false,
  fadeLong: false,
  text: '',
  withBar: false,
  isCallAgency: false,
};

RouteNumber.contextTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
};

RouteNumber.displayName = 'RouteNumber';
export default RouteNumber;
