import React from 'react';
import { MOBIZ_STATUS } from '../../../constants';

export default function statusBox({ mobilizerStatus }) {
	return (
		<>
			{mobilizerStatus === MOBIZ_STATUS.ACTIVE ? (
				<div>
					<i className="fa fa-circle text-success"></i>
					&nbsp; Active
				</div>
			) : (
				<div>
					<i className="fa fa-circle text-danger"></i>
					&nbsp; Inactive
				</div>
			)}
		</>
	);
}
