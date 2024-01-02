import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { updateDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase.config';
import Button from '../../../../components/buttons/Button';
import TextInput from '../../../../components/input/TextInput';
import Spinner2 from '../../../../components/spinners/Spinner2';

function NewVersion() {
	const [newVersion, setNewVersion] = useState('');
	const [versions, setVersions] = useState([]);
	const [infoLoading, setInfoLoading] = useState(true);

	useEffect(() => {
		const fetchKspInfo = async () => {
			try {
				const data = await getDoc(doc(db, 'kspInfo', 'info'));
				const dataParse = data.data();

				setVersions(dataParse.versions);
				setInfoLoading(false);
			} catch (error) {
				console.log(error);
			}
		};

		fetchKspInfo();
	}, []);

	const submitNewVersion = async () => {
		try {
			if (newVersion === '') {
				toast.error('No new version entered');
				return;
			}
			const newVersions = [newVersion, ...versions];
			await updateDoc(doc(db, 'kspInfo', 'info'), { versions: newVersions });
			toast.success('Version added!');
		} catch (error) {
			console.log(error);
		}
	};

	if (infoLoading) return <Spinner2 />;

	return (
		<div className="flex flex-col gap-4">
			<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Add a new KSP version</p>
			<TextInput onChange={e => setNewVersion(e.target.value)} placeholder="Version" size="w-44" />
			<Button text="submit" icon="upload" onClick={submitNewVersion} size="w-fit" color="btn-primary" />
		</div>
	);
}

export default NewVersion;
