import React from 'react';
import Button from '../../../components/buttons/Button';

function RemoveImageBtn({ stateSetter }) {
	return (
		<Button
			onClick={() =>
				stateSetter(prevState => {
					return {
						...prevState,
						iconLg: '',
						iconSm: '',
					};
				})
			}
			text="X"
			css="hover:bg-red-500"
			color="btn-error"
			size="btn-sm"
			style="btn-circle"
			position="right-0 top-0 absolute z-50"
		/>
	);
}

export default RemoveImageBtn;
