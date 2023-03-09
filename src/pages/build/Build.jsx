import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
//---------------------------------------------------------------------------------------------------//
import { AiFillEye } from 'react-icons/ai';
//---------------------------------------------------------------------------------------------------//
import youtubeLinkConverter from '../../utilities/youtubeLinkConverter';
//---------------------------------------------------------------------------------------------------//
import BuildContext from '../../context/build/BuildContext';
import AuthContext from '../../context/auth/AuthContext';
import useBuild from '../../context/build/BuildActions';
//---------------------------------------------------------------------------------------------------//
import VoteArrows from '../../components/buttons/VoteArrows';
import Spinner1 from '../../components/spinners/Spinner1';
import TypeBadge from '../../components/typeBadge/TypeBadge';
import HowToPasteBuildModal from '../../components/modals/HowToPasteModal';
import Comment from '../../components/comments/Comment';
import DeleteBuildModal from '../../components/modals/DeleteBuildModal';
import Carousel from '../../components/carousel/Carousel';
import Create from '../create/Create';
import Button from '../../components/buttons/Button';
import CantFind from '../../components/cantFind/CantFind';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import UsernameLink from '../../components/buttons/UsernameLink';
//---------------------------------------------------------------------------------------------------//

function Build() {
	//---------------------------------------------------------------------------------------------------//
	const { loadingBuild, loadedBuild, commentsLoading, comments, editingBuild } = useContext(BuildContext);
	const { user, authLoading } = useContext(AuthContext);
	const { fetchBuild, setComment, addComment, updateDownloadCount, setEditingBuild, updateBuild } = useBuild();
	const navigate = useNavigate();

	const { id } = useParams();

	useEffect(() => {
		fetchBuild(id);
	}, []);

	/**
	 * Handles copying the build to the clipboard
	 */
	const copyBuildToClipboard = async () => {
		navigator.clipboard.writeText(loadedBuild.build);
		await updateDownloadCount(loadedBuild, loadedBuild.id);
		toast.success('Build coped to clipboard!');
	};

	if (editingBuild) return <Create buildToEdit={loadedBuild} />;

	//---------------------------------------------------------------------------------------------------//
	return (
		<MiddleContainer>
			{loadingBuild ? (
				<Spinner1 />
			) : (
				<>
					{loadedBuild ? (
						<div className="flex flex-col gap-4 w-full">
							{/* Images */}
							<Carousel images={loadedBuild.images} />

							{/* Author/Uploaded/version */}
							<div className="flex flex-row flex-wrap gap-2 2k:gap-4 bg-base-900 w-full justify-center p-2 2k:p-4 mb-6 2k:mb-12 rounded-xl">
								<div className="flex flex-col gap-2 2k:gap-5 bg-base-400 p-4 2k:p-6 items-center justify-center rounded-lg">
									<p className="text-2xl 2k:text-4xl font-bold">Author</p>
									<UsernameLink username={loadedBuild.author} uid={loadedBuild.uid} />
								</div>
								<div className="flex flex-col gap-2 2k:gap-5 bg-base-400 p-5 items-center justify-center rounded-lg">
									<p className="text-2xl 2k:text-4xl font-bold">Date Created</p>
									<p className="text-xl 2k:text-3xl ">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(loadedBuild.timestamp.seconds * 1000)}</p>
								</div>
								<div className="flex flex-col gap-2 2k:gap-5 bg-base-400 p-5 items-center justify-center rounded-lg">
									<p className="text-2xl 2k:text-4xl font-bold">KSP Version</p>
									<p className="text-xl 2k:text-3xl ">{loadedBuild.kspVersion}</p>
								</div>
								<div className="flex flex-col gap-2 2k:gap-5 bg-base-400 p-5 items-center justify-center rounded-lg">
									<p className="text-2xl 2k:text-4xl font-bold">Uses Mods</p>
									<p className="text-xl 2k:text-3xl ">{loadedBuild.modsUsed ? 'Yes' : 'None'}</p>
								</div>
							</div>

							{/* Build Name */}
							<div className="flex flex-row place-content-between">
								<h1 className="text-slate-200 text-3xl font-bold 2k:text-5xl">{loadedBuild.name}</h1>
								<p className="flex flex-row text-2xl items-center gap-4 2k:text-4xl">
									<AiFillEye />
									<span className="text-lg self-end 2k:text-3xl"> {loadedBuild.views}</span>
								</p>
							</div>

							{/* Voting/Views/Types */}
							<div className="flex flex-row place-content-between mb-8 2k:mb-16">
								<div className="flex flex-row gap-8">
									<VoteArrows build={loadedBuild} />
								</div>

								{/* Types */}
								<div className="flex flex-row flex-wrap gap-2">
									{loadedBuild.type.map((type, i) => {
										return <TypeBadge key={i} type={type} />;
									})}
								</div>
							</div>

							{/* Description */}
							<p className="text-2xl 2k:text-4xl text-slate-500">ABOUT THIS BUILD</p>
							<p className="mb-20 2k:mb-32 text-xl 2k:text-3xl">{loadedBuild.description}</p>

							{/* Buttons */}
							<div className="flex flex-col md:flex-row place-content-between">
								<div className="flex flex-ro flex-wrap gap-4 mb-10">
									<Button color="btn-primary" icon="export" onClick={copyBuildToClipboard} text="Export to KSP 2" />
									<Button text="How to import into KSP" color="bg-base-900" htmlFor="how-to-paste-build-modal" icon="help" />
								</div>
								{!authLoading && (user?.uid === loadedBuild.uid || user?.siteAdmin) && (
									<div className="flex flex-row flex-wrap gap-4">
										<Button text="Edit Build" icon="edit" color="btn-info" onClick={() => setEditingBuild(true)} />
										<Button htmlFor="delete-build-modal" color="btn-error" icon="delete" text="Delete Build" />
									</div>
								)}
							</div>

							<div className="mb-6">{loadedBuild.video && <iframe src={youtubeLinkConverter(loadedBuild.video)}></iframe>}</div>

							{/* ----------------- Comments ---------------------- */}
							<p className="text-2xl 2k:text-3xl">Comments</p>
							{!authLoading && user?.username && (
								<>
									<textarea onChange={e => setComment(e.target.value)} maxLength="3000" name="" id="" placeholder="Leave a comment" rows="2" className="textarea 2k:text-2xl"></textarea>
									<Button onClick={addComment} color="bg-base-900" text="Save" size="w-fit" css="2k:mb-10" icon="comment" />
								</>
							)}
							{commentsLoading ? (
								<Spinner1 />
							) : (
								<>
									{comments.length === 0 ? (
										<p className="2k:btn-lg 2k:text-2xl mb-20">No comments yet! Be the first to leave one</p>
									) : (
										<div className="flex flex-col gap-4 mb-20">
											{comments.map((comment, i) => {
												return <Comment key={i} comment={comment} />;
											})}
										</div>
									)}
								</>
							)}
						</div>
					) : (
						<CantFind text="Oops.. Build not found">
							<Button color="btn-primary" onClick={() => navigate('/')} text="Return Home" icon="left" />
						</CantFind>
					)}
				</>
			)}
			{loadedBuild && <DeleteBuildModal id={loadedBuild.id} userID={loadedBuild.uid} />}
		</MiddleContainer>
	);
}

export default Build;