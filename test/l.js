import test from 'ava';
import d from '../';

test('l with bad value fails', t => {
	t.true(d('v=BIMI1; l=foo;').messages.some(x => /invalid value for 'l'/i.test(x)));
});

test('l with good values pass', t => {
	t.true(d('v=BIMI1; l=https://images.example.com/somedir/logo.svg;').messages === undefined);
});
