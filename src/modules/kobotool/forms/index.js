import React from 'react';
import { Card, CardBody } from 'reactstrap';

const List = props => {
	const { name } = props;
	return (
		<>
			<Card className="kobocard">
				<CardBody>
					<span>{name}</span>
				</CardBody>
			</Card>
		</>
	);
};

export default List;
