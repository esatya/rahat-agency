import React from 'react';
import Select from 'react-select';

export default function ({ id, currentValue, onChange, placeholder, multi, data, maxMenuHeight, isDisabled }) {
	const handleChange = val => {
		onChange(val);
	};

	return (
		<Select
			isDisabled={isDisabled || false}
			id={id}
			classNamePrefix="select"
			onChange={handleChange}
			options={data}
			defaultValue={currentValue && currentValue.length ? [...currentValue] : ''}
			isMulti={multi ? multi : false}
			placeholder={placeholder || '--Select Option--'}
			maxMenuHeight={maxMenuHeight || 300}
		/>
	);
}
