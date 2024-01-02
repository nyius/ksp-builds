import React, { useState } from 'react';
import { standardAlert } from '../../../utilities/standardAlert';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import { toast } from 'react-toastify';
import Button from '../../../components/buttons/Button';
import SectionContainer from './SectionContainer';

function CreateAlert() {
	const [alert, setAlert] = useState(standardAlert);
	/**
	 * Handles adding an alert to the site
	 */
	const addSiteAlert = async () => {
		try {
			if (alert.text === '') {
				toast.error('No text!');
				return;
			}
			await updateDoc(doc(db, 'kspInfo', 'alert'), alert);
			toast.success('Success');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		}
	};

	/**
	 * handles clearing the sits alert
	 */
	const clearAlert = async () => {
		try {
			await updateDoc(doc(db, 'kspInfo', 'alert'), standardAlert);
			toast.success('Success');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		}
	};

	return (
		<SectionContainer css="!flex-col gap-4" sectionName="Create Alert">
			<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Create alert</p>
			<div className="flex flex-col gap-2 2k:gap-4">
				<div className="text-xl 2k:text-2xl text-slate-200">message</div>
				<input
					type="text"
					className="input w-full"
					onChange={e =>
						setAlert(prevState => {
							return { ...prevState, text: e.target.value };
						})
					}
				/>
			</div>
			<div className="flex flex-col gap-2 2k:gap-4">
				<div className="text-xl 2k:text-2xl text-slate-200">color (red, green, yellow, primary, secondary, accent)</div>
				<input
					type="text"
					className="input w-full"
					onChange={e =>
						setAlert(prevState => {
							return { ...prevState, color: e.target.value };
						})
					}
				/>
			</div>
			<div className="flex flex-col gap-2 2k:gap-4">
				<div className="text-xl 2k:text-2xl text-slate-200">icon (alert, warning)</div>
				<input
					type="text"
					className="input w-full"
					onChange={e =>
						setAlert(prevState => {
							return { ...prevState, icon: e.target.value };
						})
					}
				/>
			</div>
			<div className="flex flex-row gap-4 2k:gap-8 mt-10">
				<Button text="create" color="btn-primary" icon="upload" size="w-fit" onClick={addSiteAlert} />
				<Button text="clear site alert" color="btn-error" icon="cancel" size="w-fit" onClick={clearAlert} />
			</div>
		</SectionContainer>
	);
}

export default CreateAlert;
