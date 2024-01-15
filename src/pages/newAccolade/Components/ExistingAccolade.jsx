import React, { useState } from 'react';
import AccoladeSectionContainer from './AccoladeSectionContainer';
import { uploadImages } from '../../../utilities/uploadImage';
import { cloneDeep } from 'lodash';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { toast } from 'react-toastify';
import Select from '../../../components/selects/Select';
import AccoladeLight from '../../../components/accolades/AccoladeLight';
import AccoladeFull from '../../../components/accolades/AccoladeFull';
import TextInput from '../../../components/input/TextInput';
import RemoveImageBtn from '../Buttons/RemoveImageBtn';
import Spinner2 from '../../../components/spinners/Spinner2';
import TextEditor from '../../../components/textEditor/TextEditor';
import Button from '../../../components/buttons/Button';
import ColorPalette from './ColorPalette';
import { useAccoladesContext } from '../../../context/accolades/AccoladesContext';
import { updateAccolade } from '../../../context/accolades/AccoladesActions';

/**
 * Displays the existing accolades section.
 * @param {*} selectedAccolade
 * @param {*} setSelectedAccolade
 * @param {*} accoladesLoading
 * @returns
 */
function ExistingAccolade({ selectedAccolade, setSelectedAccolade }) {
	const { fetchedAccolades, accoladesLoading, dispatchAccolades } = useAccoladesContext();
	const [uploadingEditImage, setUploadingEditImage] = useState(false);
	const [editAccolade, setEditAccolade] = useState(false);
	const [editAccoladeDesc, setEditAccoladeDesc] = useState(null);

	/**
	 * Handles choosing an existing accolade
	 * @param {*} e
	 */
	const handleChooseAccolade = e => {
		setSelectedAccolade(() => {
			const foundAccolade = fetchedAccolades.filter(accolade => {
				return accolade.id === e.target.id;
			});
			return foundAccolade[0];
		});

		if (editAccolade) {
			setEditAccolade(null);
		}
	};

	const { SelectBox, Option } = Select(handleChooseAccolade, '');

	/**
	 * Handles setting if we are editing an accolade or not
	 */
	const setEditingAccolade = () => {
		setEditAccolade(editAccolade ? null : { ...selectedAccolade });
		setEditAccoladeDesc(selectedAccolade.description);
	};

	/**
	 * Handles making changes to an editing accolade
	 * @param {*} e
	 */
	const handleEditAccolade = e => {
		setEditAccolade(prevState => {
			return {
				...prevState,
				[e.target.id.replace('edit_', '')]: e.target.value,
			};
		});
	};

	/**
	 * Handles adding a new image
	 * @param {*} e
	 */
	const handleNewEditImage = async e => {
		try {
			const iconSmUrl = await uploadImages(e.target.files, setUploadingEditImage, 50, 100);
			const iconLgUrl = await uploadImages(e.target.files, setUploadingEditImage);

			if (iconLgUrl) {
				setEditAccolade(prevState => {
					return {
						...prevState,
						iconLg: iconLgUrl[0],
						iconSm: iconSmUrl[0],
					};
				});
			}

			setUploadingEditImage(false);
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong uploading the image');
		}
	};

	/**
	 * handles submitting an accolade edit
	 */
	const submitAccoladeEdit = async () => {
		try {
			const accoladeToSubmit = cloneDeep(editAccolade);
			accoladeToSubmit.description = editAccoladeDesc;

			if (accoladeToSubmit.order) {
				accoladeToSubmit.order = Number(editAccolade.order);
			}

			await updateDoc(doc(db, 'accolades', accoladeToSubmit.id), accoladeToSubmit);
			updateAccolade(dispatchAccolades, accoladeToSubmit);
			toast.success('Updated!');
		} catch (error) {
			toast.error('Something went wrong');
			console.log(error);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<AccoladeSectionContainer title="Existing Accolades">
			<SelectBox size="w-[50rem]">
				{!accoladesLoading &&
					fetchedAccolades.map(accolade => {
						return <Option key={accolade?.id} displayText={accolade?.name} id={accolade?.id} />;
					})}
			</SelectBox>

			<div className="text-xl 2k:text-2xl text-slate-200">ID: {selectedAccolade?.id}</div>
			<div className="w-full grid grid-cols-3 items-start rounded-xl bg-base-300 p-6">
				<div className="text-2xl 2k:text-3xl text-slate-200 h-fit font-bold border-b-1 text-center border-solid border-slate-700 mb-6 2k:mb-10">Small</div>
				<div className="text-2xl 2k:text-3xl text-slate-200 h-fit font-bold border-b-1 text-center border-solid border-slate-700 mb-6 2k:mb-10">Medium</div>
				<div className="text-2xl 2k:text-3xl text-slate-200 h-fit font-bold border-b-1 text-center border-solid border-slate-700 mb-6 2k:mb-10">Full</div>

				{selectedAccolade ? (
					<>
						<AccoladeLight type="unlocked" accolade={selectedAccolade} size="w-8 h-8" />
						<AccoladeLight type="unlocked" accolade={selectedAccolade} size="w-16 h-16" />
						<AccoladeFull accolade={selectedAccolade} />
					</>
				) : (
					''
				)}
			</div>

			{selectedAccolade ? (
				<>
					{editAccolade ? (
						<div className="flex flex-col gap-10 2k:gap-14">
							<div className="divider"></div>
							<div className="text-2xl 2k:text-3xl text-slate-200 font-bold">Edit Accolade</div>

							{/* ------------------------------ Name ------------------------------ */}
							<div className="flex flex-row items-center gap-2 2k:gap-4 w-full">
								<div className="text-xl 2k:text-2xl text-slate-300 shrink-0 w-32 2k:w-44">Name</div>
								<TextInput color="text-white" size="w-full" value={editAccolade.name} onChange={handleEditAccolade} id="edit_name" placeholder="Enter name" />
							</div>

							{/* ------------------------------ Tooltip ------------------------------ */}
							<div className="flex flex-row items-center gap-2 2k:gap-4 w-full">
								<div className="text-xl 2k:text-2xl text-slate-300 shrink-0 w-32 2k:w-44">Tooltip</div>
								<TextInput color="text-white" size="w-full" value={editAccolade.tooltip} onChange={handleEditAccolade} id="edit_tooltip" placeholder="Enter tooltip" />
							</div>

							{/* ------------------------------ Large Icon ------------------------------ */}
							<div className="flex flex-row items-center gap-2 2k:gap-4 w-full">
								<div className="text-xl 2k:text-2xl text-slate-300 shrink-0 w-32 2k:w-44">Large Icon</div>
								<TextInput color="text-white" size="w-full" value={editAccolade.iconLg} onChange={handleEditAccolade} id="edit_iconLg" placeholder="Enter large icon url" />
							</div>

							{/* ------------------------------ Small Icon ------------------------------ */}
							<div className="flex flex-row items-center gap-2 2k:gap-4 w-full">
								<div className="text-xl 2k:text-2xl text-slate-300 shrink-0 w-32 2k:w-44">Small Icon</div>
								<TextInput color="text-white" size="w-full" value={editAccolade.iconSm} onChange={handleEditAccolade} id="edit_iconSm" placeholder="Enter small icon url" />
							</div>

							{/* ------------------------------ Order ------------------------------ */}
							<div className="flex flex-row items-center gap-2 2k:gap-4 w-full">
								<div className="text-xl 2k:text-2xl text-slate-300 shrink-0 w-32 2k:w-44">Order</div>
								<TextInput color="text-white" size="w-44" type="number" value={editAccolade.order} onChange={handleEditAccolade} id="edit_order" />
							</div>

							{/* ------------------------------ Rocket Reputation (points) ------------------------------ */}
							<div className="flex flex-row items-center gap-2 2k:gap-4 w-full">
								<div className="text-xl 2k:text-2xl text-slate-300 shrink-0 w-32 2k:w-44">Points</div>
								<TextInput color="text-white" size="w-44" type="number" value={editAccolade.points} onChange={handleEditAccolade} id="edit_points" />
							</div>

							{/* ------------------------------ Description ------------------------------ */}
							<TextEditor text={editAccolade.description} setState={setEditAccoladeDesc} />

							{/* ------------------------------ Image ------------------------------ */}
							{editAccolade.iconLg ? (
								<div className={`relative flex items-center justify-center w-36 h-36 2k:w-52 2k:h-52 hover:bg-base-100 overflow-hidden rounded-xl bg-base-300 border-slate-700 border-dashed border-2 `}>
									<RemoveImageBtn stateSetter={setEditAccolade} />
									<img src={editAccolade.iconLg} className="w-full object-scale-down cursor-pointer" />
								</div>
							) : null}
							{uploadingEditImage ? <Spinner2 /> : null}

							<div className="flex flex-row gap-4 w-full mb-2 2k:mb-4 items-center">
								<input type="file" id="edit-accolade-image" max="1" accept=".jpg,.png,.jpeg" multiple className="file-input w-full max-w-xs mb-6 2k:file-input-lg text-slate-200" onChange={e => handleNewEditImage(e)} />
								<p className="text-slate-400 text-xl 2k:text-2xl">For best results images should be 1/1 ratio</p>
							</div>
						</div>
					) : (
						''
					)}

					<div className="flex flex-row gap-2 2k:gap-4">
						{editAccolade ? <Button icon="upload" color="btn-success" size="w-fit" text="Submit" onClick={submitAccoladeEdit} /> : ''}
						<Button icon={editAccolade ? 'cancel' : 'edit'} tooltip={editAccolade ? 'Reverts all changes to the accolade.' : ''} color="btn-primary" size="w-fit" text={editAccolade ? 'Cancel' : 'Edit'} onClick={setEditingAccolade} />
						<Button htmlFor="delete-accolade-modal" text="Delete Accolade" color="btn-error" icon="delete" tooltip="Deletes this accolade permanently" />
					</div>
				</>
			) : (
				''
			)}

			<div className="divider"></div>

			<ColorPalette />
		</AccoladeSectionContainer>
	);
}

export default ExistingAccolade;
