import React from 'react';

import BeneficiaryByGender from '../../beneficiary_report/gender_pie_chart';
import BeneficiaryByAge from '../../beneficiary_report/age_bar_diagram';

const Index = ({ beneficiary, fetching, ageBarRef, genderPieRef }) => {
	return (
		<div>
			<div className="row p-4">
				<div className="col-md-8 sm-12">
					<BeneficiaryByAge ageBarRef ={ageBarRef} data={beneficiary.beneficiaryByAge} fetching={fetching} />
				</div>
				<div className="col-md-4 sm-12">
					<BeneficiaryByGender genderPieRef={genderPieRef} data={beneficiary.beneficiaryByGender} fetching={fetching} />
				</div>
			</div>
		</div>
	);
};

export default Index;
