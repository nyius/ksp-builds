import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useFilters from '../../context/filters/FiltersActions';
import FiltersContext from '../../context/filters/FiltersContext';

function VerticalVersionLink({ text }) {
	const navigate = useNavigate();
	const { versionFilter } = useContext(FiltersContext);

	const { setVersionFilter } = useFilters();

	if (versionFilter === text) {
		return (
			<li
				id={text}
				onClick={e => {
					setVersionFilter(e);
				}}
			>
				<a id={text} className="btn btn-block bg-accent text-slate-900 rounded-lg hover:bg-teal-700 text-slate-300">
					{text}
				</a>
			</li>
		);
	} else {
		return (
			<li
				id={text}
				onClick={e => {
					setVersionFilter(e);
				}}
			>
				<a id={text} className="btn btn-block text-slate-300">
					{text}
				</a>
			</li>
		);
	}
}

export default VerticalVersionLink;
