import React from 'react';

import { BeneficiaryContextProvider } from '../../../../contexts/BeneficiaryContext';
import KoboFormDetail from './detail';

const index = props => {
	return (
		<BeneficiaryContextProvider>
			<KoboFormDetail params={props.match.params} />
		</BeneficiaryContextProvider>
	);
};
export default index;
