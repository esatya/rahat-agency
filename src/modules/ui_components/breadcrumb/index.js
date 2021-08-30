import React from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';

export default function index({ root_label, current_label, redirect_path }) {
	return (
		<>
			<Breadcrumb>
				<BreadcrumbItem style={{ color: '#6B6C72' }}>
					<Link to={`/${redirect_path}`}>{root_label || 'Home'}</Link>
				</BreadcrumbItem>
				<BreadcrumbItem active-breadcrumb="true">{current_label || 'No Label'}</BreadcrumbItem>
			</Breadcrumb>
		</>
	);
}
