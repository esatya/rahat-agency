import React from 'react';

import { BeneficiaryContextProvider } from '../../../contexts/BeneficiaryContext';
import EditBeneficiary from './edit';

export default function Index({ match }) {
	return (
		<>
			<BeneficiaryContextProvider>
				<EditBeneficiary beneficiaryId={match.params.id} />
			</BeneficiaryContextProvider>
		</>
	);
}
