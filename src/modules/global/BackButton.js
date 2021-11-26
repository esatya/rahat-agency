import React from 'react';
import { useHistory } from 'react-router-dom';

export default function BackButton({ label }) {
	const history = useHistory();

	const handleGoBackClick = () => history.goBack();

	return (
		<>
			<button type="button" className="btn waves-effect waves-light btn-dark" onClick={handleGoBackClick}>
				<i class="fas fa-long-arrow-alt-left"></i> {label || 'Go Back'}
			</button>
		</>
	);
}
