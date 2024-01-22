import React, { useState, useEffect } from 'react';
import TextEditor from '../../../components/textEditor/TextEditor';
import { toast } from 'react-toastify';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { cloneDeep } from 'lodash';
import { uploadImages } from '../../../utilities/uploadImage';
import useCreateDraftJs from '../../../hooks/useCreateDraftJs';
import standardAccolade from '../../../utilities/standardAccolade';
import TextInput from '../../../components/input/TextInput';
import RemoveImageBtn from '../Buttons/RemoveImageBtn';
import Spinner2 from '../../../components/spinners/Spinner2';
import Button from '../../../components/buttons/Button';
import AccoladeFull from '../../../components/accolades/AccoladeFull';
import AccoladeLight from '../../../components/accolades/AccoladeLight';
import AccoladeSectionContainer from './AccoladeSectionContainer';
import { useAccoladesContext } from '../../../context/accolades/AccoladesContext';
import { addNewAccolade } from '../../../context/accolades/AccoladesActions';

/**
 * Displays the new accolade panel
 * @param {*} setFetchedAccolades - the setter state for all fetched accolades
 * @returns
 */
function NewAccolade() {
	const { dispatchAccolades } = useAccoladesContext();
	const [uploadingImage, setUploadingImage] = useState(false);
	const [accolade, setAccolade] = useState(standardAccolade);
	const [description, setDescription] = useCreateDraftJs(null, `{"blocks":[{"key":"87rfs","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`);

	/**
	 * Handles entering information for a new accolade
	 * @param {*} e
	 */
	const handleInput = e => {
		setAccolade(prevState => {
			return { ...prevState, [e.target.id]: e.target.value };
		});
	};

	/**
	 * Handles submitting an accolade
	 * @returns
	 */
	const submitAccolade = async () => {
		try {
			if (accolade.points === '') {
				toast.error('Points can only be a number!');
				return;
			}

			if (accolade.name === '') {
				toast.error('No name!');
				return;
			}
			if (accolade.iconLg === '') {
				toast.error('No icon image!');
				return;
			}
			const newAccolade = cloneDeep(accolade);
			newAccolade.description = description;

			if (newAccolade.order !== '') {
				newAccolade.order = Number(accolade.order);
			}

			await addDoc(collection(db, 'accolades'), newAccolade);

			const newAccoladeRef = query(collection(db, `accolades`), where('name', '==', newAccolade.name));
			const newFetchedAccoladeData = await getDocs(newAccoladeRef);
			newFetchedAccoladeData.forEach(accoladeRaw => {
				const newFetchedAccolade = accoladeRaw.data();
				newFetchedAccolade.id = accoladeRaw.id;

				addNewAccolade(dispatchAccolades, newFetchedAccolade);
			});

			toast.success('Accolade Added!');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong uploading accolade');
		}
	};

	/**
	 * Handles adding a new image
	 * @param {*} e
	 */
	const handleNewImage = async e => {
		try {
			const iconSmUrl = await uploadImages(e.target.files, setUploadingImage, 50, 100);
			const iconLgUrl = await uploadImages(e.target.files, setUploadingImage);

			if (iconLgUrl) {
				setAccolade(prevState => {
					return {
						...prevState,
						iconLg: iconLgUrl[0],
						iconSm: iconSmUrl[0],
					};
				});
			}

			setUploadingImage(false);
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong uploading the image');
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<AccoladeSectionContainer title="New Accolade">
			{/* ------------------------ Name ------------------------ */}
			<div className="flex flex-col gap-3 2k:gap-5">
				<div className="text-2xl 2k:text-3xl text-slate-200 font-bold">Accolade Name</div>
				<TextInput color="text-slate-100" id="name" onChange={handleInput} size="max-w-5xl" value={accolade.name} placeholder="Enter Accolade Name" />
			</div>

			{/* ------------------------ tooltip ------------------------ */}
			<div className="flex flex-col gap-3 2k:gap-5">
				<div className="text-2xl 2k:text-3xl text-slate-200 font-bold">Accolade Tooltip</div>
				<div className="text-xl 2k:text-2xl text-slate-400">(optional) Text to display on icon hover. Default is accolade name</div>
				<TextInput color="text-slate-100" id="tooltip" onChange={handleInput} size="max-w-5xl" value={accolade.tooltip} placeholder="Enter Accolade tooltip" />
			</div>

			{/* ------------------------ Order ------------------------ */}
			<div className="flex flex-col gap-3 2k:gap-5">
				<div className="text-2xl 2k:text-3xl text-slate-200 font-bold">Accolade Order</div>
				<div className="text-xl 2k:text-2xl text-slate-400">(optional) The order of the accolade if its part of a set (eg. bronze = 1, silver = 2, etc)</div>
				<TextInput type="number" color="text-slate-100" id="order" onChange={handleInput} size="w-44" value={accolade.order} />
			</div>

			{/* ------------------------ Rocket Reputation ------------------------ */}
			<div className="flex flex-col gap-3 2k:gap-5">
				<div className="text-2xl 2k:text-3xl text-slate-200 font-bold">Accolade Points (Rocket Reputation)</div>
				<div className="text-xl 2k:text-2xl text-slate-400">How many points of rocket reputation the user should get for unlocking this accolade</div>
				<TextInput type="number" color="text-slate-100" id="points" onChange={handleInput} size="w-44" value={accolade.points} />
			</div>

			{/* ------------------------ DESC ------------------------ */}
			<div className="flex flex-col gap-3 2k:gap-5">
				<div className="text-2xl 2k:text-3xl text-slate-200 font-bold">Description</div>
				<TextEditor text={accolade.description} setState={setDescription} />
			</div>

			{/* ------------------------ IMAGE ------------------------ */}
			<div className="flex flex-col gap-3 2k:gap-5">
				<div className="text-2xl 2k:text-3xl text-slate-200 font-bold">Accolade Icon</div>

				{accolade.iconLg ? (
					<div className={`relative flex items-center justify-center w-36 h-36 2k:w-52 2k:h-52 hover:bg-base-100 overflow-hidden rounded-xl bg-base-300 border-slate-700 border-dashed border-2 `}>
						<RemoveImageBtn stateSetter={setAccolade} />
						<img src={accolade.iconLg} className="w-full object-scale-down cursor-pointer" />
					</div>
				) : null}
				{uploadingImage ? <Spinner2 /> : null}
			</div>

			<div className="flex flex-row gap-4 w-full mb-2 2k:mb-4">
				<input type="file" id="accolade-image" max="1" accept=".jpg,.png,.jpeg" multiple className="file-input w-full max-w-xs mb-6 2k:file-input-lg text-slate-200" onChange={e => handleNewImage(e)} />
				<div className="flex flex-col">
					<p className="text-slate-400 2k:text-2xl">For best results images should be 1/1 ratio</p>
				</div>
			</div>

			<Button text="Submit" color="btn-primary" icon="upload" onClick={submitAccolade} />

			<div className="divider"></div>

			<div className="text-2xl 2k:text-3xl text-slate-200 font-bold">Preview</div>
			<div className="w-full grid grid-cols-3 items-start rounded-xl bg-base-400 p-6">
				<div className="text-2xl 2k:text-3xl text-slate-200 h-fit font-bold border-b-1 text-center border-solid border-slate-700 mb-6 2k:mb-10">Small</div>
				<div className="text-2xl 2k:text-3xl text-slate-200 h-fit font-bold border-b-1 text-center border-solid border-slate-700 mb-6 2k:mb-10">Medium</div>
				<div className="text-2xl 2k:text-3xl text-slate-200 h-fit font-bold border-b-1 text-center border-solid border-slate-700 mb-6 2k:mb-10">Full</div>

				<AccoladeLight locked="unlocked" accolade={accolade} size="w-8 h-8" />
				<AccoladeLight locked="unlocked" accolade={accolade} size="w-16 h-16" />
				<AccoladeFull accolade={accolade} description={description} />
			</div>
		</AccoladeSectionContainer>
	);
}

export default NewAccolade;
