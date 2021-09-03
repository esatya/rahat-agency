import React from 'react';
import { MobilizerContextProvider } from '../../../contexts/MobilizerContext';
import EditVendor from './edit';

export default function Index({ match }) {
	const { id } = match.params;
	return (
		<>
			<MobilizerContextProvider>
				<EditVendor mobilizerId={id} />
			</MobilizerContextProvider>
		</>
	);
}
