import { formatWord } from '../../src/utils/index';

describe('utils', () => {
	it('should replace _ with " "', () => {
		expect(formatWord('raktim_shrestha')).toEqual('raktim shrestha');
	});
	it('should replace " " with " "', () => {
		expect(formatWord('raktim shrestha')).toEqual('raktim shrestha');
	});
});
