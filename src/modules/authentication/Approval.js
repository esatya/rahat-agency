import React from 'react';

import { Row, Col } from 'reactstrap';
import Logo from '../../assets/images/rahat-logo-blue.png';
import qs from 'query-string';

export default function SignUp(props) {
	const search = qs.parse(props.location.search);

	//   const[wallet,setWallet]=useState(search.wallet_address)
	const wallet = search.wallet_address;
	return (
		<>
			<Row style={{ height: '100vh' }}>
				<Col className="left-content">
					<div className="text-center">
						<a href="/">
							{' '}
							<img src={Logo} height="200" width="460" alt="rahat logo"></img>
						</a>
						<div style={{ width: '410px' }}>
							<p className="description">
								Supporting vulnerable communities with a simple and efficient relief distribution platform.
							</p>
						</div>
					</div>
					<p className="text-copyright">Copyright © 2021 Rumsan Group of Companies | All Rights Reserved.</p>
				</Col>
				<Col className="right-content">
					<div className="text-center">
						<p className="text-title">Rahat Agency App</p>
						<p className="text-center" style={{ color: 'red' }}>
							Account not Activated
						</p>
						{wallet && (
							<p className="text-center" style={{ color: 'white', fontStyle: 'italic' }}>
								Wallet: {wallet}
							</p>
						)}

						<p className="text-subheader">Please contact hello@esatya.io to activate your account</p>
					</div>
					<p className="text-privacy">
						By signing up you acknowledge the{' '}
						<a href="https://docs.rahat.io/privacy-policy" className="privacy-policy">
							Privacy Policy
						</a>{' '}
						.
					</p>
				</Col>
			</Row>
		</>
	);
}
