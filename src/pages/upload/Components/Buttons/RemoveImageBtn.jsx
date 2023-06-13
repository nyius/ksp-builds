import React, { useContext } from 'react';
import Button from '../../../../components/buttons/Button';
import BuildContext from '../../../../context/build/BuildContext';
import { setBuildToUpload } from '../../../../context/build/BuildActions';

function RemoveImageBtn({ i }) {
	const { buildToUpload, dispatchBuild } = useContext(BuildContext);
	/**
	 * Handles removing an image that the user uploaded
	 * @param {*} i
	 */
	const removeImage = i => {
		const newImagesArr = [...buildToUpload.images];
		const newRawImagesArr = [...buildToUpload.rawImageFiles];
		newImagesArr.splice(i, 1);
		newRawImagesArr.splice(i, 1);
		setBuildToUpload(dispatchBuild, { ...buildToUpload, images: newImagesArr, rawImageFiles: newRawImagesArr });
	};

	return <Button onClick={() => removeImage(i)} text="X" css="hover:bg-red-500" color="btn-error" size="btn-sm" style="btn-circle" position="right-0 top-0 absolute z-50" />;
}

export default RemoveImageBtn;
