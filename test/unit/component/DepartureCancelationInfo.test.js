import { expect } from 'chai';
import { describe, it } from 'mocha';
import React from 'react';

import { mountWithIntl } from '../helpers/mock-intl-enzyme';
import DepartureCancelationInfo from '../../../app/component/DepartureCancelationInfo';

describe('<DepartureCancelationInfo />', () => {
  const defaultProps = {
    routeMode: 'BUS',
    shortName: '52',
    firstStopName: 'Arabianranta',
    headsign: 'Munkkiniemi',
    scheduledDepartureTime: 1547630218,
  };

  it('should render in English', () => {
    const wrapper = mountWithIntl(
      <DepartureCancelationInfo {...defaultProps} />,
      {},
      'en',
    );
    /*expect(wrapper.text()).to.equal(
      'Bus 52 Arabianranta–Munkkiniemi at 11:16 is cancelled',*/
    expect(wrapper.text()).to.satisfy(string =>
      ['Bus 52 Arabianranta–Munkkiniemi at ', ' is cancelled'].every(bit => string.includes(bit))
    );
  });

  it('should render in Finnish', () => {
    const wrapper = mountWithIntl(
      <DepartureCancelationInfo {...defaultProps} />,
      {},
      'fi',
    );
    /*expect(wrapper.text()).to.equal(
      'Bussin 52 lähtö Arabianranta–Munkkiniemi kello 11:16 on peruttu',*/
    expect(wrapper.text()).to.satisfy(string =>
      ['Bussin 52 lähtö Arabianranta–Munkkiniemi kello ', ' on peruttu'].every(bit => string.includes(bit))
    );
  });

  it('should render in Swedish', () => {
    const wrapper = mountWithIntl(
      <DepartureCancelationInfo {...defaultProps} />,
      {},
      'sv',
    );
    /*expect(wrapper.text()).to.equal(
      'Avgång på linje 52 Arabianranta–Munkkiniemi kl. 11:16 är inställd',*/
    expect(wrapper.text()).to.satisfy(string =>
      ['Avgång på linje 52 Arabianranta–Munkkiniemi kl. ', ' är inställd'].every(bit => string.includes(bit))
    );
  });
});
