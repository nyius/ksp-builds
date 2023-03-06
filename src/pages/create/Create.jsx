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
	const [hoverImage, setHoverImage] = useState(false);
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
			setBuildImages(prevState => {
				return [...prevState, ...newBuildImages];
			});
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
			buildToUpload.images = buildImages.length === 0 ? [LogoBackground] : buildImages;
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

		let newSquare, opponentPiece;

		// when dragging and dropping, when we release on a 'image', sometimes the target id isn't the square but the image itself
		// so we need to go up and get the parent square to find its id
		if (e.target.id.includes('square')) {
			newSquare = Number(e.target.id.split('-')[1]);
			setBuildImages(prevState => {
				const newArr = [...prevState];
				newArr[droppedImage] = newArr[newSquare];
				newArr[newSquare] = prevState[droppedImage];

				return newArr;
			});
		} else {
			newSquare = Number(e.target.parentElement.id.split('-')[1]);
			setBuildImages(prevState => {
				const newArr = [...prevState];
				newArr[droppedImage] = newArr[newSquare];
				newArr[newSquare] = prevState[droppedImage];

				return newArr;
			});
		}

		// Reset hover colors
		setHoverImage(false);
	};

	// Handles dragging a piece
	const drag = e => {
		e.dataTransfer.setData('text', e.target.id);
	};

	const squareStyle = i => {
		if (hoverImage === i) return { backgroundColor: '#171b21' };
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col gap-4 bg-base-400 w-full rounded-xl p-6">
			<h1 className="text-2xl 2k:text-4xl font-bold text-slate-100 mb-4">Create Build</h1>

			{/* Build Image */}
			{buildImages.length === 0 && (
				<div className="flex items-center justify-center w-36 h-36 rounded-xl bg-base-300 border-dashed border-2 border-slate-400">
					<p className="text-4xl">{<FiCameraOff />}</p>
				</div>
			)}

			<div className="flex flex-row flex-wrap gap-2 2k:gap-4">
				{buildImages.length > 0 &&
					buildImages.map((image, i) => {
						return (
							<div
								key={i}
								className="relative flex items-center justify-center w-36 h-36 2k:w-52 2k:h-52 overflow-hidden rounded-xl bg-base-300 border-dashed border-2 border-slate-700"
								onDrop={e => drop(e)}
								onDragOver={e => allowDrop(e)}
								onDragLeave={e => dragExit(e)}
								id={`square-` + i}
								style={squareStyle(i)}
							>
								<button onClick={() => removeImage(i)} className="btn btn-circle btn-error btn-sm hover:bg-red-500 right-0 top-0 absolute z-50">
									X
								</button>
								<img id={i} src={image} className="w-full object-scale-down cursor-pointer" alt="" draggable={true} onDragStart={e => drag(e)} />
							</div>
						);
					})}
				{uploadingImage && <Spinner1 />}
			</div>

			{/* Upload build iage */}
			{buildImages.length < 6 && (
				<div className="flex flex-row gap-4 w-full">
					<input type="file" id="build-image" max="6" accept=".jpg,.png,.jpeg" multiple className="file-input w-full max-w-xs mb-6 2k:file-input-lg" onChange={e => handleAddBuildImages(e)} />
					<div className="flex flex-col">
						<p className="text-slate-500 font-bold 2k:text-2xl">{buildImages.length > 6 && <span className="text-red-400 font-bold">Too many images!</span>} 6 Images max. Max size per image 5mb.</p>
						<p className="text-slate-500 2k:text-2xl">For best results images should be 16/9</p>
					</div>
				</div>
			)}

			<div className="flex flex-row gap-20 2k:mb-6">
				{/* Name */}
				<div className="flex flex-row gap-2 items-center">
					<input onChange={setName} type="text" placeholder="Build Name" className="input input-bordered w-96 max-w-lg 2k:input-lg 2k:text-2xl" maxLength="50" />
					<p className="text-slate-400 italic 2k:text-2xl">{nameLength}</p>
				</div>

				{/* KSP Version */}
				<div className="flex flex-row items-center gap-6 text-slate-400">
					<p className="2k:text-2xl">KSP Version</p>
					<select onChange={setVersion} className="select select-bordered 2k:select-lg 2k:text-2xl max-w-xs">
						<optgroup>
							<option className="text-2xl" value="1.0.0">
								1.0.0
							</option>
						</optgroup>
					</select>
				</div>

				{/* Used Mods */}
				<div className="flex flex-row items-center gap-6 text-slate-400">
					<p className="2k:text-2xl">Uses Mods</p>
					<input onChange={setModsUsed} type="checkbox" className="checkbox 2k:checkbox-lg" />
				</div>
			</div>

			{/* Description */}
			<div className="flex flex-row gap-2 items-center w-full">
				<textarea onChange={setDesc} className="textarea textarea-bordered w-3/4 2k:text-2xl 2k:mb-4" placeholder="Description" maxLength="3000" rows="4"></textarea>
				<p className="text-slate-400 italic 2k:text-2xl">{descLength}</p>
			</div>

			{/* Video */}
			<div className="flex flex-row gap-2 items-center 2k:mb-8">
				<input onChange={setVideo} type="text" placeholder="Youtube Link (optional)" className="input 2k:input-lg input-bordered w-96 max-w-lg mb-6 2k:text-2xl" />
				<p className="italic text-slate-500 2k:text-2xl">Eg. https://www.youtube.com/watch?v=dQw4w9WgXcQ</p>
			</div>

			{/* Build Types */}
			<h3 className="text-slate-400 text-xl 2k:text-3xl">Build Type (3 max)</h3>
			<div className="btn-group mb-6 2k:mb-10">
				<button onClick={e => setTypes(`Interplanetary`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${newBuild.type.includes('Interplanetary') && 'btn-active'}`}>
					Interplanetary
				</button>
				<button onClick={e => setTypes(`Interstellar`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${newBuild.type.includes('Interstellar') && 'btn-active'}`}>
					Interstellar
				</button>
				<button onClick={e => setTypes(`Satellite`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${newBuild.type.includes('Satellite') && 'btn-active'}`}>
					Satellite
				</button>
				<button onClick={e => setTypes(`Space Station`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${newBuild.type.includes('Space Station') && 'btn-active'}`}>
					Space Station
				</button>
				<button onClick={e => setTypes(`Lander`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${newBuild.type.includes('Lander') && 'btn-active'}`}>
					Lander
				</button>
				<button onClick={e => setTypes(`Rover`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${newBuild.type.includes('Rover') && 'btn-active'}`}>
					Rover
				</button>
				<button onClick={e => setTypes(`SSTO`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${newBuild.type.includes('SSTO') && 'btn-active'}`}>
					SSTO
				</button>
				<button onClick={e => setTypes(`Spaceplane`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${newBuild.type.includes('Spaceplane') && 'btn-active'}`}>
					Spaceplane
				</button>
				<button onClick={e => setTypes(`Probe`)} className={`btn 2k:btn-lg 2k:text-2xl 2k:font-thin ${newBuild.type.includes('Probe') && 'btn-active'}`}>
					Probe
				</button>
			</div>

			{/* Tags */}
			<div className="flex flex-row gap-4 items-center">
				<h3 className="text-slate-400 text-xl 2k:text-3xl">Tags (3 max)</h3>
				<h4 className="text-slate-500 text-lg italic 2k:text-2xl">Press ',' to add a new tag</h4>
			</div>
			<input id="tagsField" disabled={newBuild.tags.length === 3} onChange={setTags} type="text" placeholder="Tags" className="input 2k:input-lg 2k:text-2xl 2k:mb-6 input-bordered w-96 max-w-lg" maxLength="30" />

			<div className="flex flex-row gap-10 2k:mb-10">
				{newBuild.tags.map((tag, i) => {
					return (
						<div className="indicator" key={i}>
							<span onClick={removeTag} id={i} className="indicator-item 2k:text-2xl badge badge-error cursor-pointer">
								x
							</span>
							<div className="badge badge-lg 2k:text-2xl 2k:p-4 badge-info">{tag}</div>
						</div>
					);
				})}
			</div>

			{/* Build */}
			<div className="flex flex-row items-center gap-4">
				<h3 className="text-slate-400 text-xl 2k:text-3xl">Paste build here</h3>
				<label className="btn 2k:btn-lg 2k:text-2xl" htmlFor="how-to-copy-build-modal">
					How?
				</label>
			</div>
			<textarea onChange={setBuild} className="textarea textarea-bordered 2k:text-2xl mb-6 w-full" placeholder="Paste..." rows="4"></textarea>

			<button className="btn btn-primary 2k:btn-lg 2k:text-2xl" onClick={submitBuild}>
				Submit
			</button>

			<HowToCopyBuildModal />
		</div>
	);
}

export default Create;
