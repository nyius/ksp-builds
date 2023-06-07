import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import FiltersContext from './FiltersContext';
import { setCurrentPage } from '../builds/BuildsActions';
import BuildsContext from '../builds/BuildsContext';

const useFilters = () => {
	const { sortBy, typeFilter, versionFilter, challengeFilter, dispatchBuildFilters, modsFilter } = useContext(FiltersContext);
	const navigate = useNavigate();
	const { dispatchBuilds } = useContext(BuildsContext);

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
		setCurrentPage(dispatchBuilds, 0);
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
		setCurrentPage(dispatchBuilds, 0);
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
		setCurrentPage(dispatchBuilds, 0);
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
		setCurrentPage(dispatchBuilds, 0);
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
		setCurrentPage(dispatchBuilds, 0);
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

	return { setSearchFilter, filterBuilds, setSortFilter, setTypeFilter, setVersionFilter, resetFilters, setModsFilter, setChallengeFilter };
};

export default useFilters;
