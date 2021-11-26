import { formatWord, blobToBase64, formatBalanceAndCurrency, generateUID } from '../../src/utils/index';
import 'regenerator-runtime/runtime';

describe('utils', () => {
	it('should replace _ with " "', () => {
		expect(formatWord('raktim_shrestha')).toEqual('raktim shrestha');
	});
	it('should replace " " with " "', () => {
		expect(formatWord('raktim shrestha')).toEqual('raktim shrestha');
	});
	// it('should provide base64 string of image',() =>{
	// 	return blobToBase64().then(data => {
	// 		expect(data).toBe()
	// 	})
	// })
	// it('should generateUID where "+/" is replaced with " "', () => {
	// 	expect(generateUID(20)).toHaveLength(20);
	// });
	it('should format balance and currency', () => {
		expect(formatBalanceAndCurrency(20, 'yen')).toEqual('YEN\xa020');
	});
});
