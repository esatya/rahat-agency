import {
	formatWord,
	blobToBase64,
	formatBalanceAndCurrency,
	generateUID,
	dottedString,
	formatErrorMsg,
	renderSingleRole
} from '../../../src/utils/index';
import 'regenerator-runtime/runtime';

describe('utils', () => {
	it('should render single role', () => {
		expect(renderSingleRole('admin')).toEqual('-');
	});
	it('should replace _ with " "', () => {
		expect(formatWord('raktim_shrestha')).toEqual('raktim shrestha');
	});
	it('should replace " " with " "', () => {
		expect(formatWord('raktim shrestha')).toEqual('raktim shrestha');
	});
	// it('should provide base64 string of image', () => {
	// 	const blob =
	// 		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAACrElEQVR4nO3du27UQBjF8T90NDRIiKUh4R1QSANsTaL0vEXgEVCk1Gglbh0Nr8BFgYgS0RKJggqBRMJFsImWilA42/mCx7M+tuf8pGlWGXv8Hcszsi0HzMzMzMzMzMzM6hkDj4APwCFwPJD2E5gAZ+KVKq5LwA76Qi26PYhVsJiuAAfoi9NGOwJOxylbHEvAV/SF6X0AoRudAOdjDqTjngB/1YOYW0F/RrbVfgD36NgkPCF/sDNgE7igG1oa3pIfwKZyUCn5RX4APvMDhEzCZ6OPImExl1a3Im7LShStGGbAbWCkG1r/nArocxx9FP1xBHwC3gBPgV3FINRr8y61l8Bys3LWpz7orrUDYDW0mL4ExfGd7A7Bx7odO3WHr8fOAY9DOjqAeMbAjTZ2VHQtTMGIbKk9I78GrTy4STmAuTvk12CvjZ07gOy+V14NftfdUMxVUMi2+ixKHTwJizkAMQcg5gDEHICYAxBzAGIOQMwBiDkAMQcg5gDEHICYAxBzALBB9n7P4Ul7DaxLR1RhSA9ktik+nq2KvrI6DCWADarf+Vkr6e8AGtqlOoBXJf0dQENTqgMoe8YbpQ6ehMst/MRKOYB3kf6mdUO5BK1TfQm6WdLfc0AEWxQfz92Kvg4gkjWy1c70pO1QfubPRamDX8wKF6UOKU/CneAAxByAmAMQcwBiDkDMAYg5ADEHIOYAxByAmAMQcwBiDkDMAYg5ALGQAKYFv6f02cqLBb/X/lRBSABfCn5P6auJRcf6uY2dPyT/WWgKX00ckX0p5Q/5NbjfxiDGBTt3g2sN6lrLi5YOqE/tWaOK1rQE7C/gIPravgGXG1U0wCrp/AuTsrYPXG1Yy2DLpH05ek52NZC7TvbBuj3+77XvvrYp8J5stdPahGtmZmZmZmZmZsPwD5QWKaOgWd0gAAAAAElFTkSuQmCC';
	// 	const base64 = blobToBase64(blob);
	// 	console.log('asdffasdfas', base64);

	// 	// return blobToBase64().then(data => {
	// 		// expect(data).toBe()
	// 	// })
	// });
	// it('should generateUID where "+/" is replaced with " "', () => {
	// 	const UID = 'asda234bsvcbsd';
	// 	const guid = generateUID(UID);
	// 	console.log({ guid });
	// });
	it('should format balance and currency', () => {
		expect(formatBalanceAndCurrency(20, 'yen')).toEqual('YEN\xa020');
	});

	it('should provide dotted string', () => {
		const inputStr = 'hello';
		const len = null;
		expect(dottedString(inputStr, len)).toEqual(inputStr);
	});

	it('should format error message', () => {
		const err = null;
		expect(formatErrorMsg(err)).toEqual('This is default error message');
	});

	it('should format error message with errMessage', () => {
		const err = {
			response: {
				data: {
					message: 'This is a test error message'
				}
			}
		};
		expect(formatErrorMsg(err)).toEqual('This is a test error message');
	});
});
