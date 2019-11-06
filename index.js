'use strict';

const validator = require('validator');

const validators = {
	v: {
		required: true,
		description: 'Protocol version',
		validate(term, value) {
			if (value !== 'BIMI1') {
				throw new Error(`Invalid BIMI version: '${value}'`);
			}
		}
	},
	l: {
		description: 'The tag is point to the URL with the HTTPS-accessible SVG image file that contains a vector representation of your preferred logo.',
		validate(term, value) {
			if (!validator.isURL(value, {protocols: ['https']})) {
				throw new Error(`Invalid value for '${term}': '${value}', must be valid url with HTTPS protocol.`);
			}
		}
	},
	a: {
		description: 'The tag is point to the URL with a path your VMC certificate file (.pem) to the BIMI record.',
		validate(term, value) {
			if (!validator.isURL(value, {protocols: ['https']})) {
				throw new Error(`Invalid value for '${term}': '${value}', must be valid url with HTTPS protocol.`);
			}
		}
	}
};

function parse(policy) {
  // Steps
  // 1. Split policy string on semicolons into term pairs
  // 2. Process and validate each term pair

	let terms = policy.split(/;/)
								.map(t => t.trim()) // Trim surrounding whitespace
								.filter(x => x !== ''); // Ignore empty tags

	let rules = terms.map(
    x => x.split(/[=]/)
          .map(p => p.trim())
  );

	let retval = {
		tags: {},
		messages: []
	};

	// Make sure `v` is the first tag
	if (!/^v$/i.test(rules[0][0])) {
		retval.messages.push(`First tag in a BIMI record must be 'v', but found: '${rules[0][0]}'`);
		return retval;
	}

	for (let rule of rules) {
		let term = rule[0];
		let value = rule[1];

		let found = false;

		for (let validatorTerm of Object.keys(validators)) {
			let settings = validators[validatorTerm];

			// Term matches validaor
			let termRegex = new RegExp(`^${validatorTerm}$`, 'i');
			if (termRegex.test(term)) {
				found = true;

				let tag = {
					description: settings.description
				};

				if (settings.validate) {
					try {
						settings.validate.call(settings, term, value);
						tag.value = value;
						retval.tags[term] = tag;
					}
					catch (err) {
						retval.messages.push(err.message);
					}
				}

				break;
			}
		}

		if (!found) {
			retval.messages.push(`Unknown tag '${term}'`);
		}
	}

	// Remove "messages"
	if (retval.messages.length === 0) {
		delete retval.messages;
	}

	return retval;
}

module.exports = parse;
