/* global chai, DateBoxDate */

const setDate = new Date(2001, 0, 1, 12, 1, 0, 0);
const myDate  = new DateBoxDate(setDate);
const parseDate = new DateBoxDate('Wednesday, 03-01-2001 15:23:08', '%A, %d-%M-%Y %H:%i:%S');

myDate.forceLocale = 'en-US';

describe('DateBoxDate to Vanilla', () => {

	describe('compare times', () => {
		it('getTime and date.getTime should be equal', () => {
			chai.expect(setDate.getTime()).to.equal(myDate.date.getTime());
		});
	});

	describe('compare JSON', () => {
		it('JSON should be identical', () => {
			chai.expect(setDate.toJSON()).to.equal(myDate.J);
		});
	});
});

describe('DateBoxDate String Values', () => {
	describe('day', () => {
		it('given day is Monday', () => {
			chai.expect(myDate.A).to.equal('Monday');
		});
	});
	describe('month', () => {
		it('given month is January', () => {
			chai.expect(myDate.B).to.equal('January');
		});
	});
	describe('cookie time', () => {
		it('given date is Monday, 01-01-2001 12:01:00', () => {
			chai.expect(
				myDate.format('%A, %d-%M-%Y %H:%i:%S')
			).to.equal('Monday, 01-01-2001 12:01:00');
		});
	});
});

describe('DateBoxDate Parse Test', () => {
	describe('parse test', () => {
		it('given string was: Wednesday, Jan 3, 2001, 15:23:08', () => {
			chai.expect(parseDate.J).to.equal('2001-01-03T20:01:08.000Z');
		});
	});
});