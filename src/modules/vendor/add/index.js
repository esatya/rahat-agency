import React from 'react';

import { VendorContextProvider } from '../../../contexts/VendorContext';
import AddVendor from './add';

export default function Index() {
	return (
		<>
			<VendorContextProvider>
				<AddVendor />
			</VendorContextProvider>
		</>
	);
}
