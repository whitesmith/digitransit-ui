import { expect } from 'chai';
import { describe, it } from 'mocha';

import config from '../../../app/configurations/config.hsl';

const fareZones = {
  fi: ['AB', 'BC', 'CD', 'D', 'ABC', 'BCD', 'ABCD'],
  en: ['AB', 'BC', 'CD', 'D', 'ABC', 'BCD', 'ABCD'],
  sv: ['AB', 'BC', 'CD', 'D', 'ABC', 'BCD', 'ABCD'],
};

describe('HSL Configuration', () => {
  describe('fareMapping', () => {
    it('should map all the configured fares', () => {
      const mapped = config.fares.map(config.fareMapping);
      expect(mapped).to.have.lengthOf(config.fares.length);
      expect(mapped.some(value => value === '')).to.equal(false);
    });

    it('should map the fares in Finnish', () => {
      const mapped = config.fares.map(config.fareMapping).sort();
      expect(mapped).to.deep.equal(fareZones.fi.sort());
    });

    it('should map the fares in English', () => {
      const mapped = config.fares
        .map(fareId => config.fareMapping(fareId, 'en'))
        .sort();
      expect(mapped).to.deep.equal(fareZones.en.sort());
    });

    it('should map the fares in Swedish', () => {
      const mapped = config.fares
        .map(fareId => config.fareMapping(fareId, 'sv'))
        .sort();
      expect(mapped).to.deep.equal(fareZones.sv.sort());
    });

    it('should work with a missing fareId', () => {
      expect(config.fareMapping(undefined)).to.equal('');
      expect(config.fareMapping(null)).to.equal('');
    });

    it('should work with a malformed fareId', () => {
      expect(config.fareMapping('HSL:')).to.equal('');
    });

    it('should work with a non-string fareId', () => {
      expect(config.fareMapping({})).to.equal('');
      expect(config.fareMapping(1234)).to.equal('');
    });
  });
});
