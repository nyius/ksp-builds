import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useFilters from '../../context/filters/FiltersActions';
import FiltersContext from '../../context/filters/FiltersContext';

function VerticalTypeLink({ text }) {
	const navigate = useNavigate();
	const { typeFilter } = useContext(FiltersContext);

	const { setTypeFilter } = useFilters();
	if (typeFilter === text) {
		return (
			<li
				id={text}
				onClick={e => {
					setTypeFilter(e);
				}}
			>
				<a id={text} className="btn btn-block bg-primary hover:bg-violet-900 text-slate-300">
					{text}
				</a>
			</li>
		);
	} else {
		return (
			<li
				id={text}
				onClick={e => {
					setTypeFilter(e);
				}}
			>
				<a id={text} className="btn btn-block text-slate-300">
					{text}
				</a>
			</li>
		);
	}
}

export default VerticalTypeLink;
