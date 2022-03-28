import { expect } from 'chai';
import { MutagenConfigManipulator } from './MutagenConfigManipulator';

describe('MutagenConfigManipulator', () => { // the tests container
    it('strips non-alphanumeric characters', () => {
        const mutagenConfigManipulator = new MutagenConfigManipulator(null);
        expect(mutagenConfigManipulator.stripNonAlphaNumericFromString('ABC')).to.be.equal('ABC');
        expect(mutagenConfigManipulator.stripNonAlphaNumericFromString('123')).to.be.equal('123');
        expect(mutagenConfigManipulator.stripNonAlphaNumericFromString('x_x')).to.be.equal('xx');
        expect(mutagenConfigManipulator.stripNonAlphaNumericFromString('X_X')).to.be.equal('XX');
        expect(mutagenConfigManipulator.stripNonAlphaNumericFromString('ab!@#$%^ba')).to.be.equal('abba');
        expect(mutagenConfigManipulator.stripNonAlphaNumericFromString('')).to.be.equal('');
        expect(mutagenConfigManipulator.stripNonAlphaNumericFromString(';)')).to.be.equal('');
        expect(mutagenConfigManipulator.stripNonAlphaNumericFromString('node_modules/no_underscore')).to.be.equal('nodemodulesnounderscore');
    });
});