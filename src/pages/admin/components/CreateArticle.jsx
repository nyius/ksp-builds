import React, { useState } from 'react';
import TextInput from '../../../components/input/TextInput';
import TextEditor from '../../../components/textEditor/TextEditor';
import SectionContainer from './SectionContainer';
import { uploadImages } from '../../../utilities/uploadImage';
import { serverTimestamp } from 'firebase/firestore';
import Spinner2 from '../../../components/spinners/Spinner2';
import { toast } from 'react-toastify';
import Button from '../../../components/buttons/Button';
import { db } from '../../../firebase.config';
import { doc, setDoc } from 'firebase/firestore';

function CreateArticle() {
	const [articleContent, setArticleContent] = useState('');
	const [uploadingArticleImage, setUploadingArticleImage] = useState(false);
	const [article, setArticle] = useState({
		title: '',
		image: '',
		articleId: '',
		content: '',
		type: 'text',
		date: serverTimestamp(),
	});

	/**
	 * Handles uploading an image for a new challenge
	 * @param {*} e
	 */
	const handleUploadArticleImage = async e => {
		try {
			const newArticleImage = await uploadImages(e.target.files, setUploadingArticleImage, false, false, 16388121, true);

			if (!newArticleImage) throw new Error(newArticleImage);
			setArticle(prevState => {
				return {
					...prevState,
					image: newArticleImage[0],
				};
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handleTitle = e => {
		setArticle(prevState => {
			return {
				...prevState,
				title: e.target.value,
			};
		});
	};

	const handleImage = e => {
		setArticle(prevState => {
			return {
				...prevState,
				image: e.target.value,
			};
		});
	};

	/**
	 * Handles uploading a challenge
	 */
	const uploadArticle = async () => {
		try {
			if (!article.title) {
				console.log(`no title`);
				toast.error('Forgot article title');
				return;
			}
			if (!article.image) {
				console.log(`no image`);
				toast.error('Forgot article image');
				return;
			}
			article.content = articleContent;
			article.articleId = article.title.replace(/ /g, '-');

			await setDoc(doc(db, 'articles', article.articleId), article);

			toast.success('Challenge created!');
		} catch (error) {
			toast.error('Something went wrong creating challenge');
			console.log(error);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<SectionContainer sectionName="Create Article" css="!flex-col gap-6">
			<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Create New Article</p>
			<TextInput value={article.title} placeholder="Article Title" size="max-w-2xl" onChange={handleTitle} />
			{/* image */}
			<div className="flex flex-row gap-4 items-center mb-10">
				<label className="flex flex-col w-fit text-3xl">
					<img src="imgur.com/a/vEfecYD" alt="" />
					<span className="font-bold p-4">Image (Upload or link)</span>
					<input type="file" id="build-image" max="1" accept=".jpg,.png,.jpeg,.gif" className="file-input w-full max-w-xs mb-6 2k:file-input-lg text-slate-200" onChange={handleUploadArticleImage} />
					<TextInput value={article.image} placeholder="Image URL" size="max-w-2xl" onChange={handleImage} />
				</label>
				{uploadingArticleImage && <Spinner2 />}
				{article.image && <img src={article.image} alt="" className="w-56" />}
			</div>

			{/* Content */}

			{/* Content */}
			<TextEditor setState={setArticleContent} />
			<Button text="Create" color="btn-primary" icon="upload" size="w-fit" onClick={uploadArticle} />
		</SectionContainer>
	);
}

export default CreateArticle;
