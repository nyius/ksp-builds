import { useContext } from 'react';
import FiltersContext from './FiltersContext';

const useFilters = () => {
	const { sortBy, typeFilters, versionFilters, searchTerm, tagsSearch, dispatchBuildFilters } = useContext(FiltersContext);

	/**
	 * Handles setting search term
	 * @param {*} e
	 */
	const setSearchFilter = e => {
		dispatchBuildFilters({
			type: 'SET_FILTERS',
			payload: {
				filter: 'searchTerm',
				value: e.target.value,
			},
		});
	};

	/**
	 * Handles setting the sorting for builds
	 * @param {*} e
	 */
	const setSortFilter = e => {
		dispatchBuildFilters({
			type: 'SET_FILTERS',
			payload: {
				filter: 'sortBy',
				value: e.target.value,
			},
		});
	};

	/**
	 * Handles setting the filter for build types
	 * @param {*} e
	 */
	const setTypeFilter = e => {
		if (typeFilters.includes(e.target.id)) {
			dispatchBuildFilters({
				type: 'SET_FILTERS',
				payload: {
					filter: 'typeFilters',
					value: typeFilters.filter(x => x !== e.target.id),
				},
			});
		} else {
			dispatchBuildFilters({
				type: 'SET_FILTERS',
				payload: {
					filter: 'typeFilters',
					value: [...typeFilters, e.target.id],
				},
			});
		}
	};
	/**
	 * Handles setting the filter for build version
	 * @param {*} e
	 */
	const setVersionFilter = e => {
		if (versionFilters.includes(e.target.id)) {
			dispatchBuildFilters({
				type: 'SET_FILTERS',
				payload: {
					filter: 'versionFilters',
					value: versionFilters.filter(x => x !== e.target.id),
				},
			});
		} else {
			dispatchBuildFilters({
				type: 'SET_FILTERS',
				payload: {
					filter: 'versionFilters',
					value: [...versionFilters, e.target.id],
				},
			});
		}
	};

	/**
	 * Handles setting tags search term
	 * @param {*} e
	 */
	const setTagSearchFilter = tag => {
		dispatchBuildFilters({
			type: 'SET_FILTERS',
			payload: {
				filter: 'tagsSearch',
				value: tag,
			},
		});
	};

	/**
	 * Handles filtering the decks. Returns an array of decks that match the filters
	 * @param {*} decks
	 * @returns
	 */
	const filterBuilds = builds => {
		return builds
			.slice()
			.sort((a, b) => {
				if (sortBy === 'date_newest') {
					return a.timestamp.seconds < b.timestamp.seconds ? 1 : -1;
				} else if (sortBy === 'date_oldest') {
					return a.timestamp.seconds < b.timestamp.seconds ? -1 : 1;
				} else if (sortBy === 'upVotes') {
					return a.upVotes < b.upVotes ? 1 : -1;
				} else if (sortBy === 'comments') {
					return a.comments < b.comments ? 1 : -1;
				} else if (sortBy === 'views_most') {
					return a.views < b.views ? 1 : -1;
				} else if (sortBy === 'views_least') {
					return a.views < b.views ? -1 : 1;
				}
			})
			.filter(build => {
				if (typeFilters.length === 0) return build;

				//  check that the build has the same amount of colors as the filter
				if (typeFilters.includes(build.type)) {
					return build;
				}
			})
			.filter(build => {
				if (versionFilters.length === 0) return build;

				//  check that the build has the same amount of colors as the filter
				if (versionFilters.includes(build.kspVersion)) {
					return build;
				}
			})
			.filter(build => {
				if (searchTerm === '') return build;
				if (build.name.toLowerCase().includes(searchTerm.toLowerCase())) return build;
			})
			.filter(build => {
				if (tagsSearch === '') return build;

				const checkTags = build?.tags?.filter(tag => tag.toLowerCase().includes(tagsSearch.toLowerCase()));
				if (checkTags.length > 0) return build;
			});
	};

	return { setSearchFilter, setTagSearchFilter, filterBuilds, setSortFilter, setTypeFilter, setVersionFilter };
};

export default useFilters;
