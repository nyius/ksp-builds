import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { convertFromRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Helmet } from 'react-helmet';
//---------------------------------------------------------------------------------------------------//
import { AiFillEye } from 'react-icons/ai';
//---------------------------------------------------------------------------------------------------//
import youtubeLinkConverter from '../../utilities/youtubeLinkConverter';
import useResetStates from '../../utilities/useResetStates';
import draftJsToPlainText from '../../utilities/draftJsToPlainText';
//---------------------------------------------------------------------------------------------------//
import BuildContext from '../../context/build/BuildContext';
import AuthContext from '../../context/auth/AuthContext';
import useBuild, { setBuildOfTheWeek, setReplyingComment, setEditingBuild, useComment, useCopyBuildToClipboard } from '../../context/build/BuildActions';
import { setReport, useFetchUser } from '../../context/auth/AuthActions';
import FoldersContext from '../../context/folders/FoldersContext';
import { setAddBuildToFolderModal, setBuildToAddToFolder } from '../../context/folders/FoldersActions';
import { checkIfBuildInAllFolders } from '../../context/folders/FoldersUtilils';
//---------------------------------------------------------------------------------------------------//
import VoteArrows from '../../components/buttons/VoteArrows';
import Spinner1 from '../../components/spinners/Spinner1';
import TypeBadge from '../../components/typeBadge/TypeBadge';
import Comment from '../../components/comments/Comment';
import DeleteBuildModal from '../../components/modals/DeleteBuildModal';
import MakeBuildOfTheWeekModal from '../../components/modals/MakeBuildOfTheWeekModal';
import Carousel from '../../components/carousel/Carousel';
import Create from '../upload/Upload';
import Button from '../../components/buttons/Button';
import CantFind from '../../components/cantFind/CantFind';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import UsernameLink from '../../components/buttons/UsernameLink';
import Favorite from '../../components/buttons/Favorite';
import TextEditor from '../../components/textEditor/TextEditor';
import BotwBadge from '../../assets/BotW_badge2.png';
import BuildInfoCard from '../../components/cards/BuildInfoCard';
import DeleteCommentModal from '../../components/modals/DeleteCommentModal';
//---------------------------------------------------------------------------------------------------//

function Build() {
	//---------------------------------------------------------------------------------------------------//
	const { fetchBuild } = useBuild();
	const { copyBuildToClipboard } = useCopyBuildToClipboard();
	const { setComment, addComment } = useComment();
	const { dispatchBuild, loadingBuild, loadedBuild, commentsLoading, comments, editingBuild, replyingComment, deletingCommentId } = useContext(BuildContext);
	const { dispatchFolders } = useContext(FoldersContext);
	const { dispatchAuth, user, authLoading, fetchedUserProfile } = useContext(AuthContext);
	const [buildDesc, setBuildDesc] = useState(null);
	const [fetchingRawBuild, setFetchingRawBuild] = useState(false);

	const { fetchUsersProfile } = useFetchUser();
	const { resetStates } = useResetStates();
	const location = useLocation();
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		resetStates();
	}, []);

	// Fetch the build
	useEffect(() => {
		fetchBuild(id);
	}, [id]);

	useEffect(() => {
		if (!loadingBuild && loadedBuild) {
			if (loadedBuild.visibility === 'private' && user.uid !== loadedBuild.uid) {
				navigate('/');
			} else {
				setBuildDesc(EditorState.createWithContent(convertFromRaw(JSON.parse(loadedBuild.description))));
				fetchUsersProfile(loadedBuild.uid);
			}
		}
	}, [loadingBuild, loadedBuild]);

	/**
	 * Handles clearing the comment contents/replying context
	 */
	const handleClearComment = () => {
		setReplyingComment(dispatchBuild, null);
		setComment(null);
	};

	/**
	 * Handles setting the reported comment
	 */
	const handleSetReport = () => {
		setReport(dispatchAuth, 'build', loadedBuild);
	};

	/**
	 * Handles copying the URL to clipboard for sharing
	 */
	const handleShareBuild = () => {
		let url = document.location.href;
		navigator.clipboard.writeText(url);
		toast.success('Copied URL to clipboard!');
	};

	if (editingBuild) return <Create />;

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			{!loadingBuild && loadedBuild && (
				<Helmet>
					<meta charSet="utf-8" />
					<title>KSP Builds - {loadedBuild?.name}</title>
					<link rel="canonical" href={`https://kspbuilds.com/build/${location.pathname}`} />
				</Helmet>
			)}

			<MiddleContainer>
				{loadingBuild ? (
					<Spinner1 />
				) : (
					<>
						{loadedBuild ? (
							<div className="flex flex-col gap-4 w-full">
								{user && user?.siteAdmin ? <Button text="Make build of the week" color="btn-primary" icon="fill-star" htmlFor="build-of-the-week-modal" onClick={() => setBuildOfTheWeek(dispatchBuild, loadedBuild)} /> : null}
								{/* Images */}
								<Carousel images={loadedBuild.images} />

								{/* Author/Uploaded/version */}
								<div className="flex flex-row flex-wrap gap-4 2k:gap-5 bg-base-900 w-full justify-center p-2 2k:p-4 mb-6 2k:mb-12 rounded-xl">
									<BuildInfoCard title="Author">
										<UsernameLink username={loadedBuild.author} uid={loadedBuild.uid} />
									</BuildInfoCard>
									<BuildInfoCard title="Date Created">
										<p className="text-xl 2k:text-2xl text-accent">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(loadedBuild.timestamp.seconds * 1000)}</p>
									</BuildInfoCard>
									<BuildInfoCard title="Last Updated">
										<p className="text-xl 2k:text-2xl text-accent">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(loadedBuild.lastModified.seconds * 1000)}</p>
									</BuildInfoCard>
									<BuildInfoCard title="KSP Version">
										<p className="text-xl 2k:text-2xl text-accent">{loadedBuild.kspVersion}</p>
									</BuildInfoCard>
									<BuildInfoCard title="Part Count">
										<p className="text-xl 2k:text-2xl text-accent">{loadedBuild.partCount}</p>
									</BuildInfoCard>
									<BuildInfoCard title="Uses Mods">
										<p className="text-xl 2k:text-2xl text-accent">{loadedBuild.modsUsed ? 'Yes' : 'None'}</p>
									</BuildInfoCard>
									<BuildInfoCard title="Downloads">
										<p className="text-xl 2k:text-2xl text-accent">{loadedBuild.downloads}</p>
									</BuildInfoCard>
									{loadedBuild.buildOfTheWeek ? (
										<BuildInfoCard title="Build of the Week">
											<img src={BotwBadge} alt="" className="w-22 2k:w-30" />
											<p className="text-lg xl:text-xl 2k:text-2xl italic text-slate-500 ">
												{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(loadedBuild.buildOfTheWeek.seconds * 1000)}
											</p>
										</BuildInfoCard>
									) : null}
									{loadedBuild.forChallenge ? (
										<BuildInfoCard title="Challenge">
											<Button
												type="ahref"
												href={`/challenges/${loadedBuild.forChallenge}`}
												color="btn-ghost text-accent"
												css="single-line-truncat"
												text={loadedBuild.challengeTitle}
												size="!text-xl 2k:!text-2xl font-thin !normal-case !h-fit"
											/>
										</BuildInfoCard>
									) : null}
								</div>

								{/* Build Name/ Fav/ Voting/ Views */}
								<h1 className="text-slate-200 text-3xl font-bold 2k:text-4xl pixel-font">{loadedBuild.name}</h1>

								{/* Voting/Views/Types */}
								<div className="flex flex-row place-content-between flex-wrap mb-8 2k:mb-16">
									{/* Types */}
									<div className="flex flex-row flex-wrap gap-2">
										{loadedBuild.type.map(type => {
											return <TypeBadge key={type} type={type} />;
										})}
									</div>
									<div className="flex-row flex gap-4 2k:gap-8">
										{/* Fave */}
										<Favorite />
										{/* Vote */}
										<div className="flex flex-row gap-8">
											<VoteArrows build={loadedBuild} />
										</div>

										{/* Views */}
										<p className="flex flex-row text-2xl items-center gap-2 2k:text-4xl">
											<AiFillEye />
											<span className="text-lg 2k:text-3xl">{loadedBuild.views}</span>
										</p>
										<Button tooltip="Share" color="btn-ghost text-accent" icon="share" onClick={handleShareBuild} />
									</div>
								</div>

								{/* Description */}
								<p className="text-2xl 2k:text-4xl text-slate-500 mb-5">ABOUT THIS BUILD</p>
								<div className="mb-20 2k:mb-32 text-xl 2k:text-3xl">
									<Editor editorState={buildDesc} readOnly={true} toolbarHidden={true} />
								</div>

								{/* Buttons */}
								<div className="flex flex-col md:flex-row place-content-between">
									<div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 mb-10 w-full">
										<Button color="btn-primary" icon="export" onClick={() => copyBuildToClipboard(setFetchingRawBuild, loadedBuild.id)} text={fetchingRawBuild ? 'Copying...' : `Export to KSP 2`} />
										<Button tooltip="How to import into KSP" color="btn-info" htmlFor="how-to-paste-build-modal" icon="info" />
										{!authLoading && user?.username ? (
											<Button
												onClick={() => {
													setBuildToAddToFolder(dispatchFolders, loadedBuild.id, user);
													setAddBuildToFolderModal(dispatchFolders, true);
												}}
												color="btn-secondary"
												text={checkIfBuildInAllFolders(loadedBuild.id, user) ? `Saved` : `Save build to folder`}
												htmlFor="add-build-to-folder-modal"
												icon="save"
											/>
										) : null}
										<Button tooltip="Report" htmlFor="report-modal" color="bg-base-800 text-error" icon="report" onClick={handleSetReport} />
									</div>

									{!authLoading && (user?.uid === loadedBuild.uid || user?.siteAdmin) ? (
										<div className="flex flex-row gap-4">
											<Button tooltip="Edit Build" icon="edit" color="btn-info" onClick={() => setEditingBuild(dispatchBuild, loadedBuild)} />
											<Button htmlFor="delete-build-modal" color="btn-error" icon="delete" tooltip="Delete Build" />
										</div>
									) : null}
								</div>

								<div className="mb-6">{loadedBuild.video ? <iframe src={youtubeLinkConverter(loadedBuild.video)}></iframe> : null}</div>

								{/* --------------------------- Comments ---------------------- */}
								<p id="comments" className="text-2xl 2k:text-3xl">
									Comments
								</p>

								{commentsLoading ? (
									<Spinner1 />
								) : (
									<>
										{comments.length === 0 ? (
											<p className="2k:btn-lg 2k:text-2xl mb-20">No comments yet! Be the first to leave one</p>
										) : (
											<div className="flex flex-col gap-4 2k:gap-8 mb-20">
												{comments.map(comment => {
													return <Comment key={comment.id} comment={comment} />;
												})}
											</div>
										)}
									</>
								)}

								{!authLoading && user?.username ? (
									<>
										{!fetchedUserProfile?.blockList?.includes(user.uid) && (
											<>
												{/* Show quoted comment being replied to */}
												{replyingComment && (
													<div className="flex flex-row items-center gap-4 2k:gap-8 bg-base-800 w-full rounded-t-lg p-3 2k:p-6">
														<div className="italic text-slate-400 text-xl 2k:text-2xl shrink-0">Replying To</div>
														<UsernameLink username={replyingComment.username} uid={replyingComment.uid} />
														<p className="single-line-truncate text-xl 2k-text-2xl italic">"{draftJsToPlainText(replyingComment.comment)}"</p>
													</div>
												)}

												{/* Text Editor */}
												<TextEditor setState={setComment} />

												{/* Buttons */}
												<div id="add-comment" className="flex flex-row gap-3 2k:gap-6">
													<Button onClick={addComment} color="btn-primary" text="Save" size="w-fit" css="2k:mb-10" icon="comment" />
													<Button onClick={handleClearComment} color="bg-base-900" text="Clear" size="w-fit" css="2k:mb-10" icon="cancel" />
												</div>
											</>
										)}
									</>
								) : null}
							</div>
						) : (
							<CantFind text="Oops.. Build not found">
								<Button color="btn-primary" onClick={() => navigate('/')} text="Return Home" icon="left" />
							</CantFind>
						)}
					</>
				)}
				{loadedBuild ? <DeleteBuildModal id={loadedBuild.id} userID={loadedBuild.uid} /> : null}
				{loadedBuild ? user?.siteAdmin && <MakeBuildOfTheWeekModal /> : null}
				{loadedBuild && deletingCommentId ? <DeleteCommentModal /> : null}
			</MiddleContainer>
		</>
	);
}

export default Build;
