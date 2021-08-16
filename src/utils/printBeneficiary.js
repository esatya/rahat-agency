export const htmlResponse = (data, qrcodeImages) => {
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
	// eslint-disable-next-line array-callback-return
	data.map((d, i) => {
		const name = `Name: ${d.name}`;
		const address = `Address: ${d.address}`;
		const govtID = `Govt. ID: ${d.govt_id}`;
		const found = qrcodeImages.find(f => f.phone === d.phone);
		if (i % 2 === 0) {
			html += `
		<div class="row" style="display:flex;">
		  <div class="col-md-4" style="flex:1;height:75%;align-content:center;text-align:center;">
			<img style="height:27%; width:30%" src='${found ? found.imgUrl : ''}'>
			<div class="col-md-4" style="margin-top:5px;">
			  <label>
				<h3>${name}<h3>
				<h4>${address}<h4>
				<h4>${govtID}<h4>
			  </label>
			  <br><br>
			</div>
		  </div>`;
		} else {
			html += `
		  <div class="col-md-4" style="flex:1;height:75%;align-content:center;text-align:center;">
			<img style="height:27%; width:30%" src='${found ? found.imgUrl : ''}'>
			<div class="col-md-4" style="margin-top:5px;">
			  <label>
				<h3>${name}<h3>
				<h4>${address}<h4>
				<h4>${govtID}<h4>
			  </label>
			  <br><br>
			</div>
		  </div>
		</div>`;
		}
	});
	if (data.length % 2 !== 0) {
		html += ` 
	  <div class="col-md-4" style="flex:1;height:75%;align-content:center;text-align:center;">
	  </div>
	</div>`;
	}
	html += '</body></html>';
	return html;
};
