import { Filter } from '../index';
import { item1 } from './datas';
import { filter1 } from './filters';


describe('testing Filter', () => {
	console.info(filter1.match(item1));
	test('item 1 match filter 1', () => {
		expect(filter1.match(item1)).toBe(true);
	});
});
