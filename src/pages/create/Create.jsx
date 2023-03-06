import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash';
import { FiCameraOff } from 'react-icons/fi';
//---------------------------------------------------------------------------------------------------//
import { uploadImage, uploadImages } from '../../utilities/uploadImage';
import { standardBuild } from '../../utilities/standardBuild';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import useBuild from '../../context/build/BuildActions';
//---------------------------------------------------------------------------------------------------//
import Spinner1 from '../../components/spinners/Spinner1';
import HowToCopyBuildModal from '../../components/modals/HowToCopyBuildModal';
import LogoBackground from '../../assets/logo_bg_dark.png';

function Create() {
	const { user } = useContext(AuthContext);
	const { uploadBuild } = useBuild();

	//---------------------------------------------------------------------------------------------------//
	const [newBuild, setNewBuild] = useState(cloneDeep(standardBuild));
	const [nameLength, setNameLength] = useState(50);
	const [descLength, setDescLength] = useState(3000);
	const [uploadingImage, setUploadingImage] = useState(false);
	const [buildImages, setBuildImages] = useState([]);
	//---------------------------------------------------------------------------------------------------//

	const navigate = useNavigate();

	/**
	 * Handles setting the new name
	 * @param {*} e
	 */
	const setName = e => {
		setNewBuild(prevState => {
			return { ...prevState, name: e.target.value };
		});
		setNameLength(prevState => 50 - e.target.value.length);
	};

	/**
	 * Handles setting the video
	 * @param {*} e
	 */
	const setVideo = e => {
		setNewBuild(prevState => {
			return { ...prevState, video: e.target.value };
		});
	};

	/**
	 * Handles setting the KSP version
	 * @param {*} e
	 */
	const setVersion = e => {
		setNewBuild(prevState => {
			return { ...prevState, kspVersion: e.target.value };
		});
	};

	/**
	 * Handles setting if mods are used
	 * @param {*} e
	 */
	const setModsUsed = e => {
		setNewBuild(prevState => {
			return { ...prevState, modsUsed: e.target.checked };
		});
	};

	/**
	 * Handles setting the new description
	 * @param {*} e
	 */
	const setDesc = e => {
		setNewBuild(prevState => {
			return { ...prevState, description: e.target.value };
		});
		setDescLength(prevState => 1000 - e.target.value.length);
	};

	/**
	 * Handles setting build
	 * @param {*} e
	 */
	const setBuild = e => {
		setNewBuild(prevState => {
			return { ...prevState, build: e.target.value };
		});
	};

	/**
	 * Handles setting the build type
	 * @param {*} newType
	 */
	const setTypes = newType => {
		if (newBuild.type.includes(newType)) {
			setNewBuild(prevState => {
				return { ...prevState, type: prevState.type.filter(type => type !== newType) };
			});
		} else if (newBuild.type.length < 3) {
			setNewBuild(prevState => {
				return { ...prevState, type: [...prevState.type, newType] };
			});
		}
	};

	/**
	 * handles uploading a build image
	 */
	const handleAddBuildImages = async e => {
		// make sure we have a file uploaded
		if (e.target.files) {
			const newBuildImages = await uploadImages(e.target.files, setUploadingImage);
			setBuildImages(newBuildImages);
		}
	};

	/**
	 * Handles submitting the build
	 */
	const submitBuild = async () => {
		try {
			if (newBuild.name.trim() === '') {
				toast.error('Your build needs a name!');
				return;
			}
			if (newBuild.type.length === 0) {
				toast.error('Your build needs atleast 1 tag!');
				return;
			}
			if (newBuild.build.trim() === '') {
				toast.error('You forgot to include the build!');
				return;
			}
			if (buildImages.length > 6) {
				toast.error('Too many build images! Max 6');
				return;
			}

			// Upload the images to the DB

			const buildToUpload = cloneDeep(newBuild);
			buildToUpload.images = buildImages;
			buildToUpload.author = user.username;
			buildToUpload.uid = user.uid;

			await uploadBuild(buildToUpload).then(newId => navigate(`/build/${newId}`));
		} catch (error) {
			toast.error('Something went wrong!');
			console.log(error);
		}
	};

	/**
	 * Handles setting the tags
	 * @param {*} e
	 */
	const setTags = e => {
		// If the user hits space, add the tag
		if (e.target.value[e.target.value.length - 1] === ',') {
			const newTag = e.target.value;

			setNewBuild(prevState => {
				return { ...prevState, tags: [...prevState.tags, newTag.slice(0, newTag.length - 1).trim()] };
			});

			const tagField = document.getElementById('tagsField');
			tagField.value = '';
		}
	};

	/**
	 *
	 * @param {*} e
	 */
	const removeTag = e => {
		setNewBuild(prevState => {
			const newState = prevState.tags.splice(e.target.id, 1);
			return { ...prevState, tags: [...prevState.tags] };
		});
	};

	/**
	 * Handles removing an image that the user uploaded
	 * @param {*} i
	 */
	const removeImage = i => {
		console.log(i);
		setBuildImages(prevState => {
			const newArr = [...prevState];
			newArr.splice(i, 1);
			return newArr;
		});
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col gap-4 bg-base-400 w-full rounded-xl p-6">
			<h1 className="text-2xl 2k:text-4xl font-bold text-slate-100 mb-4">Create Build</h1>

			{/* Build Image */}
			{/* <div className="mr-4">{uploadingImage ? <Spinner1 /> : <div className="build-img rounded-xl w-full bg-cover bg-center bg-no-repeat bg-base-900" style={{ backgroundImage: `url('${buildImages[0]}')` }}></div>}</div> */}
			{buildImages.length === 0 && (
				<div className="flex items-center justify-center w-36 h-36 rounded-xl bg-base-300 border-dashed border-2 border-slate-400">
					<p className="text-4xl">{<FiCameraOff />}</p>
				</div>
			)}

			{uploadingImage ? (
				<Spinner1 />
			) : (
				<div className="flex flex-row gap-2">
					{buildImages.length > 0 &&
						buildImages.map((image, i) => {
							return (
								<div key={i} className="relative flex items-center justify-center w-36 h-36 rounded-xl bg-base-300 border-dashed border-2 border-slate-700">
									<button onClick={() => removeImage(i)} className="btn btn-circle btn-error btn-sm hover:bg-red-500 right-0 top-0 absolute z-50">
										X
									</button>
									<img src={image} className="w-36 object-scale-down" alt="" />
								</div>
							);
						})}
				</div>
			)}

			{/* Upload build iage */}
			<div className="flex flex-row gap-4 w-full">
				<input type="file" id="build-image" max="6" accept=".jpg,.png,.jpeg" multiple className="file-input w-full max-w-xs mb-6" onChange={e => handleAddBuildImages(e)} />
				<div className="flex flex-col">
					<p className="text-slate-500 font-bold">{buildImages.length > 6 && <span className="text-red-400 font-bold">Too many images!</span>} 6 Images max. Max size per image 5mb.</p>
					<p className="text-slate-500">For best results images should be 16/9</p>
				</div>
			</div>

			<div className="flex flex-row gap-20">
				{/* Name */}
				<div className="flex flex-row gap-2 items-center">
					<input onChange={setName} type="text" placeholder="Build Name" className="input input-bordered w-96 max-w-lg" maxLength="50" />
					<p className="text-slate-400 italic">{nameLength}</p>
				</div>

				{/* KSP Version */}
				<div className="flex flex-row items-center gap-6 text-slate-400">
					<p>KSP Version</p>
					<select onChange={setVersion} className="select select-bordered max-w-xs">
						<optgroup>
							<option value="1.0.0">1.0.0</option>
						</optgroup>
					</select>
				</div>

				{/* Used Mods */}
				<div className="flex flex-row items-center gap-6 text-slate-400">
					<p>Uses Mods</p>
					<input onChange={setModsUsed} type="checkbox" className="checkbox" />
				</div>
			</div>

			{/* Description */}
			<div className="flex flex-row gap-2 items-center w-full">
				<textarea onChange={setDesc} className="textarea textarea-bordered w-3/4" placeholder="Description" maxLength="3000" rows="4"></textarea>
				<p className="text-slate-400 italic">{descLength}</p>
			</div>

			{/* Video */}
			<div className="flex flex-row gap-2 items-center">
				<input onChange={setVideo} type="text" placeholder="Youtube Link (optional)" className="input input-bordered w-96 max-w-lg mg-6" />
				<p className="italic text-slate-500">Eg. https://www.youtube.com/watch?v=dQw4w9WgXcQ</p>
			</div>

			{/* Build Types */}
			<h3 className="text-slate-400 text-xl ">Build Type (3 max)</h3>
			<div className="btn-group mb-6">
				<button onClick={e => setTypes(`Interplanetary`)} className={`btn ${newBuild.type.includes('Interplanetary') && 'btn-active'}`}>
					Interplanetary
				</button>
				<button onClick={e => setTypes(`Interstellar`)} className={`btn ${newBuild.type.includes('Interstellar') && 'btn-active'}`}>
					Interstellar
				</button>
				<button onClick={e => setTypes(`Satellite`)} className={`btn ${newBuild.type.includes('Satellite') && 'btn-active'}`}>
					Satellite
				</button>
				<button onClick={e => setTypes(`Space Station`)} className={`btn ${newBuild.type.includes('Space Station') && 'btn-active'}`}>
					Space Station
				</button>
				<button onClick={e => setTypes(`Lander`)} className={`btn ${newBuild.type.includes('Lander') && 'btn-active'}`}>
					Lander
				</button>
				<button onClick={e => setTypes(`Rover`)} className={`btn ${newBuild.type.includes('Rover') && 'btn-active'}`}>
					Rover
				</button>
				<button onClick={e => setTypes(`SSTO`)} className={`btn ${newBuild.type.includes('SSTO') && 'btn-active'}`}>
					SSTO
				</button>
				<button onClick={e => setTypes(`Spaceplane`)} className={`btn ${newBuild.type.includes('Spaceplane') && 'btn-active'}`}>
					Spaceplane
				</button>
				<button onClick={e => setTypes(`Probe`)} className={`btn ${newBuild.type.includes('Probe') && 'btn-active'}`}>
					Probe
				</button>
			</div>

			{/* Tags */}
			<div className="flex flex-row gap-4">
				<h3 className="text-slate-400 text-xl">Tags (3 max)</h3>
				<h4 className="text-slate-500 text-lg italic">Press ',' to add a new tag</h4>
			</div>
			<input id="tagsField" disabled={newBuild.tags.length === 3} onChange={setTags} type="text" placeholder="Tags" className="input input-bordered w-96 max-w-lg" maxLength="30" />
			<div className="flex flex-row gap-10">
				{newBuild.tags.map((tag, i) => {
					return (
						<div className="indicator" key={i}>
							<span onClick={removeTag} id={i} className="indicator-item badge badge-error cursor-pointer">
								x
							</span>
							<div className="badge badge-lg badge-info">{tag}</div>
						</div>
					);
				})}
			</div>

			{/* Build */}
			<div className="flex flex-row items-center gap-4">
				<h3 className="text-slate-400 text-xl">Paste build here</h3>
				<label className="btn" htmlFor="how-to-copy-build-modal">
					How?
				</label>
			</div>
			<textarea onChange={setBuild} className="textarea textarea-bordered mb-6 w-full" placeholder="Paste..." rows="4"></textarea>

			<button className="btn btn-primary" onClick={submitBuild}>
				Submit
			</button>

			<HowToCopyBuildModal />
		</div>
	);
}

export default Create;
