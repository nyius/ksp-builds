import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FiltersContext from './FiltersContext';
import useBuilds from '../builds/BuildsActions';

const useFilters = () => {
	const { sortBy, typeFilter, versionFilter, challengeFilter, searchTerm, tagsSearch, dispatchBuildFilters, modsFilter } = useContext(FiltersContext);
	const { setCurrentPage } = useBuilds();
	const navigate = useNavigate();

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
		setCurrentPage(0);
	};

	/**
	 * Handles setting the filter for build types
	 * @param {*} e
	 */
	const setTypeFilter = type => {
		if (typeFilter === type) {
			dispatchBuildFilters({
				type: 'SET_FILTERS',
				payload: {
					filter: 'typeFilter',
					value: '',
				},
			});

			navigate('/');
			return 'navigate';
		} else {
			dispatchBuildFilters({
				type: 'SET_FILTERS',
				payload: {
					filter: 'typeFilter',
					value: type,
				},
			});
		}
		setCurrentPage(0);
	};

	/**
	 * Handles setting the filter for build version
	 * @param {*} e
	 */
	const setVersionFilter = e => {
		dispatchBuildFilters({
			type: 'SET_FILTERS',
			payload: {
				filter: 'versionFilter',
				value: e.target.value,
			},
		});
		setCurrentPage(0);
	};

	/**
	 * Handles setting the filter for if build uses mods
	 * @param {*} e
	 */
	const setModsFilter = e => {
		dispatchBuildFilters({
			type: 'SET_FILTERS',
			payload: {
				filter: 'modsFilter',
				value: e.target.value,
			},
		});
		setCurrentPage(0);
	};

	/**
	 * Handles setting the filter for if build uses mods
	 * @param {*} e
	 */
	const setChallengeFilter = e => {
		dispatchBuildFilters({
			type: 'SET_FILTERS',
			payload: {
				filter: 'challengeFilter',
				value: e?.target?.value ? e.target.value : e,
			},
		});
		setCurrentPage(0);
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
		setCurrentPage(0);
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
					return a.commentCount < b.commentCount ? 1 : -1;
				} else if (sortBy === 'views_most') {
					return a.views < b.views ? 1 : -1;
				}
			})
			.filter(build => {
				if (challengeFilter === 'any') return build;
				if (build.forChallenge === challengeFilter) return build;
			})
			.filter(build => {
				if (versionFilter === 'any') return build;
				if (build.kspVersion === versionFilter) return build;
			})
			.filter(build => {
				if (modsFilter === 'any') return build;
				if (build.modsUsed && modsFilter === 'yes') {
					return build;
				} else if (!build.modsUsed && modsFilter === 'no') {
					return build;
				}
			})
			.filter(build => {
				if (tagsSearch === '') return build;

				const checkTags = build?.tags?.filter(tag => tag.toLowerCase().includes(tagsSearch.toLowerCase()));
				if (checkTags.length > 0) return build;
			});
	};

	/**
	 * Handles reseting the filter
	 */
	const resetFilters = () => {
		dispatchBuildFilters({
			type: 'RESET_FILTERS',
		});
	};

	return { setSearchFilter, setTagSearchFilter, filterBuilds, setSortFilter, setTypeFilter, setVersionFilter, resetFilters, setModsFilter, setChallengeFilter };
};

export default useFilters;
