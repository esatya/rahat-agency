import React from 'react';
import { VendorContextProvider } from '../../../contexts/VendorContext';
import EditVendor from './edit';

export default function Index({ match }) {
	const { id } = match.params;
	return (
		<>
			<VendorContextProvider>
				<EditVendor vendorId={id} />
			</VendorContextProvider>
		</>
	);
}
