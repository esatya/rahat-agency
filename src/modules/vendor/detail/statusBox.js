import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';

import { VENDOR_STATUS, STATUS_ACTIONS } from '../../../constants';

export default function StatusBox({ vendorStatus, handleApproveRejectClick, handleSwitchChange, loading }) {
	return (
		<>
			{loading ? (
				<Button disabled={true}>Changing status...</Button>
			) : (
				<div>
					{vendorStatus === VENDOR_STATUS.NEW ? (
						<div>
							<ButtonGroup>
								<Button type="button" onClick={() => handleApproveRejectClick(STATUS_ACTIONS.APPROVE)} color="success">
									Approve
								</Button>
								<Button type="button" onClick={() => handleApproveRejectClick(STATUS_ACTIONS.REJECT)} color="danger">
									Reject
								</Button>
							</ButtonGroup>
						</div>
					) : (
						<BootstrapSwitchButton
							checked={vendorStatus === VENDOR_STATUS.ACTIVE ? true : false}
							onlabel="Active"
							offlabel="Inactive"
							width={140}
							height={30}
							onstyle="success"
							onChange={handleSwitchChange}
						/>
					)}
				</div>
			)}
		</>
	);
}
