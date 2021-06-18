/**
 * DateBox6
 * @fileOverview Date Class
 * @author J.T.Sage <jtsage+datebox@gmail.com>
 * @license {@link https://github.com/jtsage/datebox6/blob/master/LICENSE.txt|MIT}
 * @version 6.0.0
 */


/* global DateBoxDate */
class DateBoxDate {
	date      = null;
	hasTime   = false;
	localFunc = function(string) { return `000000000000:${string}`; };


	constructor(date = null, hasTime = false, localFunc = null) {
		//Object.prototype.toString.call(x) === '[object Date]'
		//new Intl.DateTimeFormat('en-US', { weekday: 'long' })
		//new Intl.DateTimeFormat('en-US', { month: 'long' })
		if ( localFunc !== null ) { this.localFunc = localFunc; }
		if ( date !== null ) {
			this.date = date;
		} else if ( hasTime === false ) {
			const tempDate = new Date();
			this.date = new Date(
				tempDate.getFullYear(),
				tempDate.getMonth(),
				tempDate.getDate(),
				8, 0, 0, 0
			);
		} else {
			this.date = new Date();
		}
	}

	get copy() {
		return new DateBoxDate(new Date(this.date.getTime()), this.hasTime, this.localFunc);
	}

	// a : Abbreviated Name of Day
	get a() { return this.localFunc('daysOfWeekShort')[this.w]; }

	// A : Full Name of Day
	get A() { return this.localFunc('daysOfWeek')[this.w]; }

	// b : Abbreviated Name of Month
	get b() { return this.localFunc('monthsOfYearShort')[this.m - 1]; }

	// B : Full Name of Month
	get B() { return this.localFunc('monthsOfYear')[this.m - 1]; }

	// C : Century (First 2 digits of a modern year)
	get C() { return parseInt(this.Y / 100, 10); }

	// d : Day of Month
	get d()      { return this.date.getDate(); }
	set d(value) { this.date.setDate(value); }

	// E : Year of the Buddhist Era (Nominally Year + 543). Note, this may be wrong pre-1940CE
	get E() { return this.get.getFullYear() + 543; }

	// G : The ISO 8601 week-based year with century as a decimal number.
	// The 4-digit year corresponding to the ISO week number (see %V).
	// This has the same format and value as %Y, except that if the ISO week number belongs
	//to the previous or next year, that year is used instead.
	get G() {
		if ( this.getDWeek(4) === 1 && this.m > 1 ) {
			return this.Y + 1;
		}
		if ( this.getDWeek(4) > 51 && this.m < 12 ) {
			return this.Y - 1;
		}
		return this.Y;
	}

	// g : Like %G, but without century, that is, with a 2-digit year (00-99).
	get g() { return this.G % 100; }

	// %H : 24-Hour, Hour of day (01..23)
	set H(value) { this.date.setHours(value); }
	get H()      { return this.date.getHours(); }
	
	// %I : 12-Hour, Hour of day (01..12)
	get I() {
		const currentHour = this.date.getHours();
		switch ( true ) {
			case ( currentHour === 0 ) :
				return 12;
			case ( currentHour < 13 ) :
				return currentHour;
			default :
				return currentHour - 12;
		}
	}

	// %j : The day of the year as a decimal number (range 001 to 366).
	get j() {
		const tempDate = new Date(this.Y, 0, 1);
		return Math.ceil((this.date - tempDate) / 86400000)+1;
	}

	// J : toJSON() JavaScript Date Method output. Can be read in a parser only when it is alone.
	get J() { return this.date.toJSON(); }
	
	// %k : 24-Hour, Hour of day (01..23) (Alias of %H)
	get k() { return this.H; }

	// %l : 12-Hour, Hour of day (01..12) (Alias of %I)
	get l() { return this.I; }

	// %m : Month of year (01..12)
	set m(value) { this.date.setMonth(value - 1); }
	get m() { return this.date.getMonth() + 1; }
	
	// %M : Minute of the hour (00..59)
	set M(value) { this.date.setMinutes(value); }
	get M() { return this.date.getMinutes(); }

	// %o : Date ordinal ( st / nd / rd / th )
	get o() {
		const fullNum = this.d;
		const ending  = this.d % 10;

		if ( ( fullNum > 9 && fullNum < 21 ) || ending > 3 ) { return 'th'; }
		return ['th', 'st', 'nd', 'rd'][ ending ];
	}

	// %p : Meridian Letters (AM/PM) in uppercase
	get p() { return this.localFunc('meridiem')[(this.H < 12) ? 0 : 1]; }

	// %P : Meridian Letters (AM/PM) in lowercase
	get P() { return this.p.toUpperCase(); }

	// %s : The number of seconds since the Epoch, 1970-01-01 00:00:00, in the local timezone
	set s(value) { this.date.setTime(value * 1000); }
	get s() { return Math.floor( this.date.getTime() / 1000 );}

	// %S : Seconds (00..59)
	set S(value) { this.date.setSeconds(value) ;}
	get S() { return this.date.getSeconds(); }

	// %u : The numeric day of the week (1-7), 1 = Sunday
	get u() { return this.date.getDay() + 1; }

	// %U : The week number of the current year as a decimal number, range 00 to 53, starting
	// with the first Sunday as the first day of week 01. See also %V and %W.
	get U() { return this.getDWeek(0); }

	// %V : The ISO 8601 week number of the current year as a decimal number, range 01 to 53,
	// where week 1 is the first week that has at least 4 days in the new year.
	get V() { return this.getDWeek(4); }

	// %w : The numeric day of the week (0-6), 0 = Sunday
	get w() { return this.date.getDay(); }

	// %W : The week number of the current year as a decimal number, range 00 to 53, starting
	// with the first Monday as the first day of week 01.
	get W() { return this.getDWeek(1); }

	// %y : Year (00-99) (2 Digit)
	get y() { return this.date.getFullYear() % 100; }

	// %Y : Full Year (4 Digit)
	set Y(value) { this.date.setFullYear(value); }
	get Y() { return this.date.getFullYear(); }

	set epoch(value) { this.s = value; }
	get epoch() { return this.s; }

	get epochDays() { return Math.floor( this.date.getTime() / ( 1000*60*60*24 ) ); }

	setPart(part, value) {
		switch ( part ) {
			case 0 : this.date.setFullYear( value );     break;
			case 1 : this.date.setMonth( value );        break;
			case 2 : this.date.setDate( value );         break;
			case 3 : this.date.setHours( value );        break;
			case 4 : this.date.setMinutes( value );      break;
			case 5 : this.date.setSeconds( value );      break;
			case 6 : this.date.setMilliseconds( value ); break;
			default : break;
		}
		return this;
	}

	z(operator) {
		const thisValue = this[operator];
		if ( typeof thisValue !== 'number' ) {
			return thisValue;
		}
		return ( parseInt(thisValue, 10) < 10 ) ?`0${thisValue}` : thisValue;
	}

	get iso() {
		return `${this.z('Y')}-${this.z('m')}-${this.z('d')}`;
	}

	get comp() {
		return parseInt(`${this.z('Y')}${this.z('m')}${this.z('d')}`, 10);
	}

	toArray() {
		return [
			this.Y,
			this.m,
			this.d,
			this.H,
			this.M,
			this.S
		];
	}

	toString() {
		return this.date.toString();
	}

	firstDay(day) {
		this.d = 1;
		this.d = this.d + ( day - this.w );
		if ( this.d > 10 ) { this.d = this.d + 7; }
		return this;
	}

	changedCopy(adjust, override) {
		const myAdj  = Object.assign([0, 0, 0, 0, 0, 0], adjust );
		const myOver = Object.assign([0, 0, 0, 0, 0, 0], override );
		return new DateBoxDate(new Date(
			( ( myOver[ 0 ] > 0 ) ? myOver[ 0 ] : this.Y + myAdj[ 0 ] ),
			( ( myOver[ 1 ] > 0 ) ? myOver[ 1 ] : this.m + myAdj[ 1 ] ),
			( ( myOver[ 2 ] > 0 ) ? myOver[ 2 ] : this.d + myAdj[ 2 ] ),
			( ( myOver[ 3 ] > 0 ) ? myOver[ 3 ] : this.H + myAdj[ 3 ] ),
			( ( myOver[ 4 ] > 0 ) ? myOver[ 4 ] : this.M + myAdj[ 4 ] ),
			( ( myOver[ 5 ] > 0 ) ? myOver[ 5 ] : this.S + myAdj[ 5 ] ),
			0
		), this.hasTime, this.localFunc);
	}

	setDWeek (type, num) {
		this.m = 1;
		this.d = 1;
		this.firstDay(type);
		if ( type === 4 ) { this.d = this.d - 3; }
		this.d = this.d + ( (num - 1) * 7);
		return this;
	}

	getDWeek(type) {
		let t1 = null;
		let t2 = null;

		switch ( type ) {
			case 0:
				t1 = this.changedCopy([0, -1*this.m]).firstDay(0);
				return Math.floor(
					( this.date.getTime() - ( t1.date.getTime() + (
						( this.date.getTimezoneOffset() - t1.date.getTimezoneOffset() ) * 60000
					))) / 6048e5 ) + 1;
			case 1:
				t1 = this.changedCopy([0, -1*this.m]).firstDay(1);
				return Math.floor(
					( this.date.getTime() - ( t1.date.getTime() + (
						( this.date.getTimezoneOffset() - t1.date.getTimezoneOffset() ) * 60000
					))) / 6048e5 ) + 1;
			case 4:
				// this line is some bullshit.  but it does work.
				// (trap for dec 29, 30, or 31st being in the new year's week - these
				// are the only 3 that can possibly fall like this)
				if ( this.m === 11 && this.d > 28 ) { return 1; }

				t1 = this.changedCopy([0, -1*this.m]).firstDay(4);
				t1.d = t1.d - 3;
				
				t2 = Math.floor(
					( this.date.getTime() - ( t1.date.getTime() + (
						( this.date.getTimezoneOffset() - t1.date.getTimezoneOffset() ) * 60000
					))) / 6048e5 ) + 1;

				if ( t2 < 1 ) {
					t1 = this.changedCopy([-1, -1*this.m]).firstDay(4);
					t1.d = t1.d - 3;
					
					return Math.floor((this.date.getTime() - t1.date.getTime()) / 6048e5) + 1;
				}
				return t2;
			default:
				return 0;
		}
	}
}