import React from 'react';

import BeneficiaryByGender from '../../beneficiary_report/gender_pie_chart';
import BeneficiaryByAge from '../../beneficiary_report/age_bar_diagram';

const Index = ({ beneficiary }) => {
	return (
		<div>
			<div className="row p-4">
				<div className="col-md-8 sm-12">
					<BeneficiaryByAge data={beneficiary.beneficiaryByAge} />
				</div>
				<div className="col-md-4 sm-12">
					<BeneficiaryByGender data={beneficiary.beneficiaryByGender} />
				</div>
			</div>
		</div>
	);
};

export default Index;
