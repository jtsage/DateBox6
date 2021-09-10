/**
 * DateBox6
 * @fileOverview Date Class
 * @author J.T.Sage <jtsage+datebox@gmail.com>
 * @license {@link https://github.com/jtsage/datebox6/blob/master/LICENSE.txt|MIT}
 * @version 6.0.0
 */


/* global DateBoxDate */
class DateBoxDate {
	date          = null;
	#forcedLocale = null;
	currentLocale = null;

	get forceLocale() { return this.#forcedLocale; }
	set forceLocale(value) {
		this.#forcedLocale = value;
		if ( value !== null ) {
			this.currentLocale = value;
		} else {
			this.currentLocale = Intl.DateTimeFormat().resolvedOptions().locale;
		}
	}

	constructor(...args) {
		let fallBack = true;
		this.forceLocale = null;

		if ( args.length === 1 && typeof args[0] === 'number' ) {
			this.date = new Date(args[0]);
			fallBack = false;
		}
		if ( args.length === 1 && Object.prototype.toString.call(args[0]) === '[object Date]') {
			this.date = new Date(
				args[0].getFullYear(),
				args[0].getMonth(),
				args[0].getDate(),
				args[0].getHours(),
				args[0].getMinutes(),
				args[0].getSeconds(),
				0
			);
			fallBack = false;
		}
		if ( args.length === 2 ) {
			const parsedDate = this.parse(args[0], args[1]);
			this.date = new Date(
				parsedDate.getFullYear(),
				parsedDate.getMonth(),
				parsedDate.getDate(),
				parsedDate.getHours(),
				parsedDate.getMinutes(),
				parsedDate.getSeconds(),
				0
			);
			fallBack = false;
		}
		if ( args.length === 3 ) {
			if ( typeof args[0] === 'number' ) {
				this.date = new Date(
					parseInt(args[0], 10),
					parseInt(args[1], 10),
					parseInt(args[2], 10),
					8, 0, 0, 0
				);
			}
			const parsedDate = this.parse(args[0], args[1], args[2]);
			this.date = new Date(
				parsedDate.getFullYear(),
				parsedDate.getMonth(),
				parsedDate.getDate(),
				parsedDate.getHours(),
				parsedDate.getMinutes(),
				parsedDate.getSeconds(),
				0
			);
			fallBack = false;
		}
		if ( args.length === 6 ) {
			this.date = new Date(
				parseInt(args[0], 10),
				parseInt(args[1], 10),
				parseInt(args[2], 10),
				parseInt(args[3], 10),
				parseInt(args[4], 10),
				parseInt(args[5], 10),
				0
			);
			fallBack = false;
		}
		if ( args.length === 2 ) {
			// parse format (arg[1]), date string (arg[0])
			fallBack = false;
		}
		if ( fallBack ) {
			this.date = new Date();
		}

		
	}

	get copy() {
		return new DateBoxDate(this.date.getTime());
	}

	// a : Abbreviated Name of Day
	get a() {
		return Intl.DateTimeFormat(this.currentLocale, { weekday : 'short' }).format(this.date);
	}

	// A : Full Name of Day
	get A() {
		return Intl.DateTimeFormat(this.currentLocale, { weekday : 'long' }).format(this.date);
	}

	// b : Abbreviated Name of Month
	get b() {
		return new Intl.DateTimeFormat(this.currentLocale, { month : 'short' }).format(this.date);
	}

	// B : Full Name of Month
	get B() {
		return new Intl.DateTimeFormat(this.currentLocale, { month : 'long' }).format(this.date);
	}

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
	
	// %i : Minutes of day (00..59)
	set i(value) { this.date.setMinutes(value); }
	get i()      { return this.date.getMinutes(); }
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
	get p() { return ['am', 'pm'][(this.H < 12) ? 0 : 1]; }

	// %P : Meridian Letters (AM/PM) in lowercase
	get P() { return this.p.toUpperCase(); }

	// %s : The number of seconds since the Epoch, 1970-01-01 00:00:00, in the local timezone
	set s(value) { this.date.setTime(value * 1000); }
	get s() { return Math.floor( this.date.getTime() / 1000 );}

	// %S : Seconds (00..59)
	set S(value) { this.date.setSeconds(value) ;}
	get S() { return this.date.getSeconds(); }

	// %T : Time zone offset as a digital (hours) (-24..+24)
	get T() {
		const offsetHours     = this.date.getTimezoneOffset() / 60;
		const offsetDirection = offsetHours < 0 ? '-' : '+';
		const offsetDigit     = Math.abs(offsetHours);

		return `${offsetDirection}${(( offsetDigit < 10 ) ? '0' : '')}${offsetDigit}`;
	}

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
			// Why?  Because *everything* goes through here.  Don't zero pad name of month, etc.
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
		return new DateBoxDate(
			( ( myOver[ 0 ] > 0 ) ? myOver[ 0 ] : this.Y + myAdj[ 0 ] ),
			( ( myOver[ 1 ] > 0 ) ? myOver[ 1 ] : this.m + myAdj[ 1 ] ),
			( ( myOver[ 2 ] > 0 ) ? myOver[ 2 ] : this.d + myAdj[ 2 ] ),
			( ( myOver[ 3 ] > 0 ) ? myOver[ 3 ] : this.H + myAdj[ 3 ] ),
			( ( myOver[ 4 ] > 0 ) ? myOver[ 4 ] : this.M + myAdj[ 4 ] ),
			( ( myOver[ 5 ] > 0 ) ? myOver[ 5 ] : this.S + myAdj[ 5 ] )
		);
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

	format ( dateFormat, locale = null ) {
		const backupLocale = this.currentLocale;

		if ( locale !== null ) { this.currentLocale = locale; }

		const returnValue = dateFormat.replace(/%(0|-)*([1-9a-zA-Z])/g, (match, pad, operator) => {
			if ( typeof this[operator] !== 'undefined' ) {
				if ( pad === '-' ) {
					return this[operator];
				}
				return this.z(operator);
			}
			return match;
		});

		if ( locale !== null ) { this.currentLocale = backupLocale; }

		return returnValue;
	}

	parse (dateString, dateFormat, locale = null ) {
		const backupLocale = this.currentLocale;

		if ( locale !== null ) { this.currentLocale = locale; }

		const rgxNames = [];
		const dPart = {
			year     : null,
			month    : null,
			date     : null,
			hour     : null,
			mins     : null,
			secs     : null,
			yearDay  : null,
			meridian : null,
			week     : null,
			weekType : 4,
			weekDay  : null,
		};

		if ( dateFormat === '%J' ) {
			const tempDate = new Date(dateString);
			if ( isNaN(tempDate.getDate()) ) {
				this.currentLocale = backupLocale;
				return null;
			}
			this.currentLocale = backupLocale;
			return tempDate;
		}

		let formatRegex = dateFormat.replace( /%(0|-)*([a-z])/gi, ( match, pad, operator ) => {
			rgxNames.push( operator );
			switch ( operator ) {
				case 'p' :
				case 'P' :
				case 'b' :
				case 'B' : return `(${match}|.+?)`;
				case 'H' :
				case 'k' :
				case 'I' :
				case 'l' :
				case 'm' :
				case 'M' :
				case 'S' :
				case 'V' :
				case 'U' :
				case 'u' :
				case 'W' :
				case 'd' : return `(${match}|[0-9]{${((pad === '0') ? '1,' : '')}2})`;
				case 'j' : return `(${match}|[0-9]{3})`;
				case 's' : return `(${match}|[0-9]+)`;
				case 'g' :
				case 'y' : return `(${match}|[0-9]{2})`;
				case 'E' :
				case 'G' :
				case 'Y' : return `(${match}|[0-9]{1,4})`;
				default  : rgxNames.pop(); return '.+?';
			}
		});

		formatRegex = new RegExp( `^${formatRegex}$` );
		const rgxInput  = formatRegex.exec(dateString);
		const rgxFormat = formatRegex.exec(dateFormat);

		if ( rgxInput === null || rgxInput.length !== rgxFormat.length ) {
			// Parse Failed.
			return null;
		}

		for ( let i = 1; i < rgxInput.length; i++ ) {
			const intVal = parseInt( rgxInput[i], 10);
			switch ( rgxNames[i-1] ) {
				case 's' : return new Date( intVal * 1000 );
				case 'Y' :
				case 'G' : dPart.year = intVal; break;
				case 'E' : dPart.year = intVal - 543; break;
				case 'y' :
				case 'g' : dPart.year = (( intVal < 50 ) ? 2000 : 1900) + intVal; break;
				case 'm' : dPart.month = intVal - 1; break;
				case 'd' : dPart.date = intVal; break;
				case 'H' :
				case 'k' :
				case 'I' :
				case 'l' : dPart.hour = intVal; break;
				case 'M' : dPart.mins = intVal; break;
				case 'S' : dPart.secs = intVal; break;
				case 'u' : dPart.weekDay = intVal - 1; break;
				case 'w' : dPart.weekDay = intVal; break;
				case 'j' : dPart.yearDay = intVal; break;
				case 'V' : dPart.week = intVal; dPart.weekType = 4; break;
				case 'U' : dPart.week = intVal; dPart.weekType = 0; break;
				case 'W' : dPart.week = intVal; dPart.weekType = 1; break;
				case 'p' :
				case 'P' :
					dPart.meridian = ( rgxInput[i].toLowerCase() === 'am' ) ? -1 : 1;
					break;
				case 'b' : {
					const monthIndex = this.monthsShort.indexOf( rgxInput[i] );
					if ( monthIndex > -1 ) { dPart.month = monthIndex; }
					break;
				}
				case 'B' : {
					const monthIndex = this.monthsLong.indexOf( rgxInput[i] );
					if ( monthIndex > -1 ) { dPart.month = monthIndex; }
					break;
				}
				default :
					break;
			}
		}

		if ( dPart.meridian !== null ) {
			if ( dPart.meridian === -1 && dPart.hour === 12 ) {
				dPart.hour = 0;
			}
			if ( dPart.meridian === 1 && dPart.hour !== 12 ) {
				dPart.hour = dPart.hour + 12;
			}
		}
		
		const testDate = new Date(
			this.#unNull( dPart.year, 0 ),
			this.#unNull( dPart.month, 0 ),
			this.#unNull( dPart.date, 1 ),
			this.#unNull( dPart.hour, 8 ),
			this.#unNull( dPart.mins, 0 ),
			this.#unNull( dPart.secs, 0 ),
			0
		);

		if ( dPart.year < 100 && dPart.year !== -1 ) {
			testDate.setFullYear(dPart.year);
		}

		/* If we got at least Y-m-d, and it's valid, return it */
		if ( dPart.year !== null &&
			dPart.month !== null &&
			dPart.date !== null ) {

			if ( !isNaN(testDate.getDate()) ) {
				this.currentLocale = backupLocale;
				return testDate;
			}
		}

		if ( dPart.yearDay !== null ) {
			testDate.setMonth(0);
			testDate.setDate(1);
			testDate.setDate(dPart.yearDay);
		}

		if ( locale !== null ) { this.currentLocale = backupLocale; }

		if ( !isNaN(testDate.getDate()) ) {
			return testDate;
		}
		return null;

	}

	get monthsShort() { return this.#monthsForLocale('short'); }
	get monthsLong()  { return this.#monthsForLocale('long'); }

	#monthsForLocale ( monthFormat ) {
		const format = new Intl.DateTimeFormat(this.currentLocale, {month : monthFormat}).format;
		return [...Array(12).keys()].map((m) => format(new Date(2001, m, 1)));
	}

	#unNull (value, myDefault) {
		return ( value === null ) ? myDefault : value;
	}
}