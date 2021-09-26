import './style.css';
import React from 'react';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import RahatLogo from '../../../../assets/images/main_logo.png';

const QRGenerator = React.forwardRef(({ props }, ref) => {
	//send props as {min: 1, max: 5, amount: null}
	const [data, setData] = useState([]);

	function getQrData(projectVersion, amount, serialNumber) {
		if (projectVersion > 999) throw Error('project version should be less than 1000');
		if (serialNumber > 100) throw Error('cannot generate more than 100 qr codes');
		const id = `555${String(projectVersion).padStart(3, '0')}${String(serialNumber).padStart(4, '0')}`;
		return { qrData: `phone:${id}?amount=${amount}`, id };
	}

	useEffect(() => {
		if (props && props.max > props.min) {
			const dataList = [];
			try {
				for (let i = props.min; i < props.max; i++) {
					const { qrData, id } = getQrData(props.projectVersion, props.amount, i);
					dataList.push({ text: qrData, id });
				}
				setData(dataList);
			} catch (error) {
				alert(error);
			}
		}
	}, [props]);

	return (
		<div className="wrapper" ref={ref}>
			{data.map((d, i) => {
				return (
					<div className="itemWrapper printme printQr" key={i}>
						<img src={RahatLogo} width="190px" height="90px"></img>
						<QRCode
							value={d.text}
							size={200}
							bgColor={'#ffffff'}
							fgColor={'#000000'}
							level={'L'}
							includeMargin={false}
							renderAs={'svg'}
						/>
						<div className="textWrapper">
							<strong><h3>{d.id}</h3></strong>
						</div>
					</div>
				);
			})}
		</div>
	);
});

export default QRGenerator;
