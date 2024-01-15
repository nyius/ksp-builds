import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase.config';
import Button from '../../../components/buttons/Button';
import TextEditor from '../../../components/textEditor/TextEditor';
import Spinner2 from '../../../components/spinners/Spinner2';
import { uploadImages } from '../../../utilities/uploadImage';
import SectionContainer from './SectionContainer';

function CreateChallenge() {
	const [uploadingChallengeImage, setUploadingChallengeImage] = useState(false);
	const [challengeContent, setChallengeContent] = useState('');
	const [challenge, setChallenge] = useState({
		image: '',
		title: '',
		date: serverTimestamp(),
		articleId: '',
		type: 'challenge',
		url: '',
		article: '',
	});

	/**
	 * Handles uploading a challenge
	 */
	const uploadChallenge = async () => {
		try {
			if (!challenge.title) {
				console.log(`no title`);
				toast.error('Forgot challenge title');
				return;
			}
			if (!challenge.image) {
				console.log(`no image`);
				toast.error('Forgot challenge image');
				return;
			}
			challenge.article = challengeContent;
			challenge.articleId = challenge.title.replace(/ /g, '-');

			await setDoc(doc(db, 'challenges', challenge.articleId), challenge);

			toast.success('Challenge created!');
		} catch (error) {
			toast.error('Something went wrong creating challenge');
			console.log(error);
		}
	};

	/**
	 * Handles uploading an image for a new challenge
	 * @param {*} e
	 */
	const handleUploadChallengeImage = async e => {
		try {
			const newChallengeImage = await uploadImages(e.target.files, setUploadingChallengeImage);

			setChallenge(prevState => {
				return {
					...prevState,
					image: newChallengeImage[0],
				};
			});
		} catch (error) {
			console.log(error);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<SectionContainer css="!flex-col gap-4" sectionName="Create Challenge">
			<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Create New Challenge</p>

			<div className="input-group text-3xl mb-10">
				<span>Title</span>
				<input
					type="text"
					className="input w-full text-3xl text-white"
					placeholder="Challenge Title"
					onChange={e =>
						setChallenge(prevState => {
							return { ...prevState, title: e.target.value };
						})
					}
				/>
			</div>

			{/* image */}
			<div className="flex flex-row gap-4 items-center mb-10">
				<label className="flex flex-row w-fit text-3xl">
					<span className="font-bold p-4">Image</span>
					<input type="file" id="build-image" max="1" accept=".jpg,.png,.jpeg" className="file-input w-full max-w-xs mb-6 2k:file-input-lg text-slate-200" onChange={handleUploadChallengeImage} />
				</label>
				{uploadingChallengeImage && <Spinner2 />}
				{challenge.image && <img src={challenge.image} alt="" className="w-56" />}
			</div>

			{/* Content */}
			<TextEditor setState={setChallengeContent} />
			<Button text="Create" color="btn-primary" icon="upload" size="w-fit" onClick={uploadChallenge} />
		</SectionContainer>
	);
}

export default CreateChallenge;
