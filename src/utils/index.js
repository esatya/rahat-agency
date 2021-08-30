export const formatWord = word => {
	if (!word) return '-';
	return word.replace(/_/g, ' ');
};

export const blobToBase64 = blob => {
	const reader = new FileReader();
	reader.readAsDataURL(blob);
	return new Promise(resolve => {
		reader.onloadend = () => {
			resolve(reader.result);
		};
	});
};
