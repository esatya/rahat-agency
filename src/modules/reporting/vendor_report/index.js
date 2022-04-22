import React, { useState } from 'react';
import { Button, Card, CardBody, CardTitle, Input, Label } from 'reactstrap';

const VendorReport = () => {
	const [importing, setImporting] = useState(false);

	const [formData, setFormData] = useState({
		from: '',
		to: ''
	});

	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleExportClick = () => {};

	return (
		<div className="main">
			<div className="transaction-table-container">
				<Card>
					<CardTitle className="mb-0 ml-3 pt-3">
						<span>Vendor report</span>
					</CardTitle>
					<CardBody>
						<div className="mt-3 mb-0">
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div className="d-flex align-items-center">
									<Label className="mr-3">From:</Label>
									<Input className="mr-3" name="from" type="date" onChange={handleInputChange} />

									<Label className="mr-3">To:</Label>
									<Input type="date" name="to" onChange={handleInputChange} />
								</div>

								<div>
									{importing ? (
										<Button type="button" disabled={true} className="btn" color="info">
											Exporting...
										</Button>
									) : (
										<Button
											type="button"
											onClick={handleExportClick}
											className="btn"
											color="info"
											outline={true}
											style={{ borderRadius: '8px' }}
										>
											Export
										</Button>
									)}
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

export default VendorReport;
