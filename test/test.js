import test from 'ava';
import d from '../';

test('First tag must be: v', t => {
	let ret = d('l=https://images.example.com/somedir/logo.svg; v=BIMI1');
	t.true(ret.messages.some(x => /first tag.+?but found: 'l'/i.test(x)));
});

test('Must have valid BIMI version', t => {
	let ret = d('v=BIMI0');
	t.true(ret.messages.some(x => /invalid BIMI version/i.test(x)));
});

test('Lower-case BIMI fails', t => {
	let ret = d('v=bimi1');
	t.true(ret.messages.some(x => /invalid BIMI version/i.test(x)));
});

test('Invalid term fails', t => {
	let ret = d('v=BIMI1; foo=bar');
	t.true(ret.messages.some(x => /Unknown tag 'foo'/i.test(x)));
});

test('Ignore empty tags', t => {
	let ret = d('v=BIMI1; l=https://images.example.com/somedir/logo.svg;');
	t.falsy(ret.messages);
});

test('Ignore empty tags and whitespace', t => {
	let ret = d('v=BIMI1; l=https://images.example.com/somedir/logo.svg;  ');
	t.falsy(ret.messages);
});
