import React from 'react';
import Button from '../../../buttons/Button';
import useFilters from '../../../../context/filters/FiltersActions';
import { useNavigate } from 'react-router-dom';

/**
 * Displays the reset filters button
 * @returns
 */
function ResetFiltersBtn() {
	const { resetFilters } = useFilters();
	const navigate = useNavigate();

	const reset = () => {
		resetFilters();
		navigate('/');
	};

	return <Button icon="reset" text="Reset" onClick={reset} color="bg-base-300" margin="mt-6 2k:mt-10" size="w-full" />;
}

export default ResetFiltersBtn;
