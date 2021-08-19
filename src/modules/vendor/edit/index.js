import React from 'react';

import { VendorContextProvider } from '../../../contexts/VendorContext';
import EditVendor from './edit';

export default function Index() {
	return (
		<>
			<VendorContextProvider>
				<EditVendor />
			</VendorContextProvider>
		</>
	);
}
