export const formatWord = word => {
	if (!word) return '-';
	return word.replace(/_/g, ' ');
};
