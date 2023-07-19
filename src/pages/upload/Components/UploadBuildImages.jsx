import React, { useState } from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import { FiCameraOff } from 'react-icons/fi';
import { setBuildToUpload, useGetEditingBuildRawImages } from '../../../context/build/BuildActions';
import { uploadImages } from '../../../utilities/uploadImage';
import Spinner1 from '../../../components/spinners/Spinner1';
import RemoveImageBtn from './Buttons/RemoveImageBtn';

/**
 * Handles dragging a piece
 * @param {*} e
 */
const drag = e => {
	e.dataTransfer.setData('text', e.target.id);
};

/**
 * Component for handling the builds images
 * @returns
 */
function UploadBuildImages() {
	const [uploadingImage, setUploadingImage] = useState(false);
	const [hoverImage, setHoverImage] = useState(false);
	const { dispatchBuild, buildToUpload } = useBuildContext();

	useGetEditingBuildRawImages();

	// Allows an image to be dropped on (for rearranging images)
	const allowDrop = e => {
		e.preventDefault();
		if (e.target.id.includes('square')) {
			setHoverImage(e.target.id.split('-')[1]);
		} else {
			setHoverImage(Number(e.target.parentElement.id.split('-')[1]));
		}
	};

	/**
	 * Stop highlighting a image square when not dragging over it
	 * @param {*} e
	 */
	const dragExit = e => {
		setHoverImage(false);
	};

	/**
	 * Handles dropping a image after dragging it
	 * @param {*} e
	 */
	const drop = e => {
		e.preventDefault();
		let droppedImage = Number(e.dataTransfer.getData('text'));

		let newSquare;

		// when dragging and dropping, when we release on a 'image', sometimes the target id isn't the square but the image itself
		// so we need to go up and get the parent square to find its id
		if (e.target.id.includes('square')) {
			newSquare = Number(e.target.id.split('-')[1]);

			const newArr = [...buildToUpload.images];
			newArr[droppedImage] = newArr[newSquare];
			newArr[newSquare] = buildToUpload.images[droppedImage];

			const newRawImages = [...buildToUpload.images];
			const img1 = newRawImages[droppedImage];
			const img2 = newRawImages[newSquare];
			newRawImages[droppedImage] = img2;
			newRawImages[newSquare] = img1;
			setBuildToUpload(dispatchBuild, { ...buildToUpload, images: newArr, rawImageFiles: newRawImages });
		} else {
			newSquare = Number(e.target.parentElement.id.split('-')[1]);

			const newArr = [...buildToUpload.images];
			newArr[droppedImage] = newArr[newSquare];
			newArr[newSquare] = buildToUpload.images[droppedImage];

			const newRawImages = [...buildToUpload.rawImageFiles];
			const img1 = newRawImages[droppedImage];
			const img2 = newRawImages[newSquare];
			newRawImages[droppedImage] = img2;
			newRawImages[newSquare] = img1;
			setBuildToUpload(dispatchBuild, { ...buildToUpload, images: newArr, rawImageFiles: newRawImages });
		}

		// Reset hover colors
		setHoverImage(false);
	};

	/**
	 * Styles the images square if its hovered
	 * @param {*} i
	 * @returns
	 */
	const squareStyle = i => {
		if (hoverImage === i) return { backgroundColor: '#171b21' };
	};

	/**
	 * handles uploading a build image
	 */
	const handleAddBuildImages = async e => {
		// make sure we have a file uploaded
		if (e.target.files) {
			const newBuildImages = await uploadImages(e.target.files, setUploadingImage);
			const newBuildImagesSmall = await uploadImages(e.target.files, setUploadingImage, 50, 100);

			if (newBuildImages) {
				setBuildToUpload(dispatchBuild, {
					...buildToUpload,
					images: [...buildToUpload.images, ...newBuildImages],
					imagesSmall: [...buildToUpload.imagesSmall, ...newBuildImagesSmall],
					rawImageFiles: [...buildToUpload.rawImageFiles, ...e.target.files],
				});
			}
		}
	};

	//---------------------------------------------------------------------------------------------------//
	if (buildToUpload) {
		return (
			<>
				{/* Image Carousel */}
				{buildToUpload.images.length === 0 ? (
					<div className="flex items-center justify-center w-36 h-36 rounded-xl bg-base-300 border-dashed border-2 border-slate-400">
						<p className="text-4xl">{<FiCameraOff />}</p>
					</div>
				) : null}

				{/* Image Carousel */}
				<div className="flex flex-row flex-wrap gap-2 2k:gap-4 mb-5 2k:mb-10">
					{buildToUpload.images.length > 0
						? buildToUpload.images.map((image, i) => {
								return (
									<div
										key={i}
										className={`relative flex items-center justify-center w-36 h-36 2k:w-52 2k:h-52 hover:bg-base-100 overflow-hidden rounded-xl bg-base-300 border-dashed border-2 ${
											i === 0 ? 'border-blue-700' : 'border-slate-700'
										} `}
										onDrop={e => drop(e)}
										onDragOver={e => allowDrop(e)}
										onDragLeave={e => dragExit(e)}
										id={`square-` + i}
										style={squareStyle(i)}
									>
										<RemoveImageBtn i={i} />
										{i === 0 && <div className="badge badge-sm absolute bottom-1 left-1 text-lg 2k:text-xl p-2 2k:p-3">Thumbnail</div>}
										<img id={i} src={image} className="w-full object-scale-down cursor-pointer" alt="" draggable={true} onDragStart={e => drag(e)} />
									</div>
								);
						  })
						: null}
					{uploadingImage ? <Spinner1 /> : null}
				</div>

				{/* Upload build image */}
				{buildToUpload.images.length < 6 ? (
					<div className="flex flex-row gap-4 w-full mb-2 2k:mb-4">
						<input type="file" id="build-image" max="6" accept=".jpg,.png,.jpeg" multiple className="file-input w-full max-w-xs mb-6 2k:file-input-lg text-slate-200" onChange={e => handleAddBuildImages(e)} />
						<div className="flex flex-col">
							<p className="text-slate-400 font-bold 2k:text-2xl">{buildToUpload.images.length > 6 && <span className="text-red-400 font-bold">Too many images!</span>} 6 Images max. Max size per image 5mb.</p>
							<p className="text-slate-400 2k:text-2xl">For best results images should be 16/9</p>
						</div>
					</div>
				) : null}
			</>
		);
	}
}

export default UploadBuildImages;
