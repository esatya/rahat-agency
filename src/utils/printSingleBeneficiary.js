export const htmlResponse = (data, qrImgUrl) => {
	const name = `Name: ${data.name}`;
	const address = `Address: ${data.address}`;
	const govtID = `Govt. ID: ${data.govt_id}`;
	let html = `<html>
	
	<head>
	<style>
	*{
	  margin:0;
	  top:0;
	 }
	</style>
	</head>
	<body>
	`;

	html += `
		<div class="row" style="display:flex;">
		  <div class="col-md-4" style="flex:1;height:75%;align-content:center;text-align:center;">
			<img style="height:27%; width:30%" src='${qrImgUrl || ''}'>
			<div class="col-md-4" style="margin-top:5px;">
			  <label>
				<h3>${name}<h3>
				<h4>${address}<h4>
				<h4>${govtID}<h4>
			  </label>
			  <br><br>
			</div>
		  </div>`;

	html += '</body></html>';
	return html;
};
