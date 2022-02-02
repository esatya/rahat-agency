import React from 'react';
import { Button } from 'reactstrap';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { useToasts } from 'react-toast-notifications';

import { TOAST } from '../../constants';

export const ExportToExcel = ({ apiData, fileName }) => {
	const { addToast } = useToasts();

	const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
	const fileExtension = '.xlsx';

	const exportToCSV = () => {
		if (!fileName) fileName = 'Excel-Report';
		if (apiData.length < 1) return addToast('No data available to export', TOAST.ERROR);
		const ws = XLSX.utils.json_to_sheet(apiData);
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileName + fileExtension);
	};

	return (
		<Button type="button" onClick={exportToCSV} className="btn" color="info">
			<i className="fas fa-arrow-circle-right"></i> &nbsp; Export
		</Button>
	);
};
