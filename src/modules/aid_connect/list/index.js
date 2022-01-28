import React from 'react';
import { AidConnectContextProvider } from '../../../contexts/AidConnectContext';
import List from './list';

const index = () => {
	return (
		<AidConnectContextProvider>
			<List />
		</AidConnectContextProvider>
	);
};

export default index;
