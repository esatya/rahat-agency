import React from 'react';
import { MobilizerContextProvider } from '../../../contexts/MobilizerContext';
import AddMobilizer from './add';

const index = () => {
	return (
		<MobilizerContextProvider>
			<AddMobilizer />
		</MobilizerContextProvider>
	);
};

export default index;
