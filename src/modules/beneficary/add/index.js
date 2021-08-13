import React from 'react';

import { BeneficiaryContextProvider } from '../../../contexts/BeneficiaryContext';
import AddBeneficiary from './add';

export default function Index() {
	return (
		<>
			<BeneficiaryContextProvider>
				<AddBeneficiary />
			</BeneficiaryContextProvider>
		</>
	);
}
