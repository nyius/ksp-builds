import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useFilters from '../../context/filters/FiltersActions';
import FiltersContext from '../../context/filters/FiltersContext';

function VerticalVersionLink({ text }) {
	const navigate = useNavigate();
	const { versionFilters } = useContext(FiltersContext);

	const { setVersionFilter } = useFilters();

	if (versionFilters.includes(text)) {
		return (
			<li
				id={text}
				onClick={e => {
					setVersionFilter(e);
				}}
			>
				<a id={text} className="btn btn-block bg-secondary hover:bg-fuchsia-900 text-slate-300">
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
