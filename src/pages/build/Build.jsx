import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { convertFromRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Helmet } from 'react-helmet';
//---------------------------------------------------------------------------------------------------//
import { AiFillEye } from 'react-icons/ai';
import { RiMedalFill } from 'react-icons/ri';
//---------------------------------------------------------------------------------------------------//
import youtubeLinkConverter from '../../utilities/youtubeLinkConverter';
import useResetStates from '../../utilities/useResetStates';
import draftJsToPlainText from '../../utilities/draftJsToPlainText';
//---------------------------------------------------------------------------------------------------//
import BuildContext from '../../context/build/BuildContext';
import AuthContext from '../../context/auth/AuthContext';
import useBuild from '../../context/build/BuildActions';
import useAuth from '../../context/auth/AuthActions';
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
//---------------------------------------------------------------------------------------------------//

function Build() {
	//---------------------------------------------------------------------------------------------------//
	const { fetchBuild, setComment, addComment, updateDownloadCount, setEditingBuild, setReplyingComment, setBuildOfTheWeek } = useBuild();
	const { loadingBuild, loadedBuild, commentsLoading, comments, editingBuild, replyingComment } = useContext(BuildContext);
	const { user, authLoading, fetchedUserProfile } = useContext(AuthContext);
	const [buildDesc, setBuildDesc] = useState(null);

	const { setReport, fetchUsersProfile } = useAuth();
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
	 * Handles copying the build to the clipboard
	 */
	const copyBuildToClipboard = async () => {
		navigator.clipboard.writeText(loadedBuild.build);
		await updateDownloadCount(loadedBuild, loadedBuild.id);
		toast.success('Build coped to clipboard!');
	};

	/**
	 * Handles clearing the comment contents/replying context
	 */
	const handleClearComment = () => {
		setReplyingComment(null);
		setComment(null);
	};

	/**
	 * Handles setting the reported comment
	 */
	const handleSetReport = () => {
		setReport('build', loadedBuild);
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
								{user && user?.siteAdmin && <Button text="Make build of the week" color="btn-primary" icon="fill-star" htmlFor="build-of-the-week-modal" onClick={() => setBuildOfTheWeek(loadedBuild)} />}
								{/* Images */}
								<Carousel images={loadedBuild.images} />

								{/* Author/Uploaded/version */}
								<div className="flex flex-row flex-wrap gap-2 2k:gap-4 bg-base-900 w-full justify-center p-2 2k:p-4 mb-6 2k:mb-12 rounded-xl">
									<div className="flex flex-col gap-2 2k:gap-5 bg-base-400 p-2 lg:p-4 2k:p-6 items-center justify-center rounded-lg">
										<p className="text-lg xl:text-2xl 2k:text-4xl font-bold">Author</p>
										<UsernameLink username={loadedBuild.author} uid={loadedBuild.uid} />
									</div>
									<div className="flex flex-col gap-2 2k:gap-5 bg-base-400 p-2 lg:p-4 2k:p-6 items-center justify-center rounded-lg">
										<p className="text-lg xl:text-2xl 2k:text-4xl font-bold">Date Created</p>
										<p className="text-xl 2k:text-3xl text-accent">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(loadedBuild.timestamp.seconds * 1000)}</p>
									</div>
									<div className="flex flex-col gap-2 2k:gap-5 bg-base-400 p-2 lg:p-4 2k:p-6 items-center justify-center rounded-lg">
										<p className="text-lg xl:text-2xl 2k:text-4xl font-bold">KSP Version</p>
										<p className="text-xl 2k:text-3xl text-accent ">{loadedBuild.kspVersion}</p>
									</div>
									<div className="flex flex-col gap-2 2k:gap-5 bg-base-400 p-2 lg:p-4 2k:p-6 items-center justify-center rounded-lg">
										<p className="text-lg xl:text-2xl 2k:text-4xl font-bold">Uses Mods</p>
										<p className="text-xl 2k:text-3xl text-accent ">{loadedBuild.modsUsed ? 'Yes' : 'None'}</p>
									</div>
									<div className="flex flex-col gap-2 2k:gap-5 bg-base-400 p-2 lg:p-4 2k:p-6 items-center justify-center rounded-lg">
										<p className="text-lg xl:text-2xl 2k:text-4xl font-bold">Downloads</p>
										<p className="text-xl 2k:text-3xl text-accent ">{loadedBuild.downloads}</p>
									</div>
									{loadedBuild.buildOfTheWeek && (
										<div className="flex flex-col gap-2 2k:gap-5 bg-base-400 p-2 lg:p-4 2k:p-6 items-center justify-center rounded-lg">
											<img src={BotwBadge} alt="" className="w-22 2k:w-44" />
											<p className="text-lg xl:text-2xl 2k:text-4xl font-bold">Build of the Week</p>
											<p className="text-lg xl:text-2xl 2k:text-4xl italic text-slate-500 ">
												{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(loadedBuild.buildOfTheWeek.seconds * 1000)}
											</p>
										</div>
									)}
									{loadedBuild.forChallenge && (
										<div className="flex flex-col gap-2 2k:gap-5 bg-base-400 w-44  lg:w-96 p-2 lg:p-4 2k:p-6 items-center justify-center rounded-lg">
											<p className="text-lg xl:text-2xl 2k:text-4xl font-bold">Challenge</p>
											<Button
												type="ahref"
												href={`/challenges/${loadedBuild.forChallenge}`}
												color="btn-ghost text-accent"
												css="single-line-truncat"
												text={loadedBuild.challengeTitle}
												size="!text-xl 2k:!text-3xl font-thin !normal-case !h-fit"
											/>
											{/* <p className="text-xl 2k:text-3xl text-accent multi-line-truncate">{loadedBuild.challengeTitle}</p> */}
										</div>
									)}
								</div>

								{/* Build Name/ Fav/ Voting/ Views */}
								<div className="flex flex-row place-content-between">
									<h1 className="text-slate-200 text-3xl font-bold 2k:text-5xl">{loadedBuild.name}</h1>

									<div className="flex-row flex gap-4 2k:gap-8">
										{/* Fave */}
										<Favorite />
										{/* Vote */}
										<div className="flex flex-row gap-8">
											<VoteArrows build={loadedBuild} />
										</div>

										{/* Views */}
										<p className="flex flex-row text-2xl items-center gap-4 2k:text-4xl">
											<AiFillEye />
											<span className="text-lg 2k:text-3xl"> {loadedBuild.views}</span>
										</p>
									</div>
								</div>

								{/* Voting/Views/Types */}
								<div className="flex flex-row place-content-between mb-8 2k:mb-16">
									{/* Types */}
									<div className="flex flex-row flex-wrap gap-2">
										{loadedBuild.type.map((type, i) => {
											return <TypeBadge key={i} type={type} />;
										})}
									</div>
								</div>

								{/* Description */}
								<p className="text-2xl 2k:text-4xl text-slate-500 mb-5">ABOUT THIS BUILD</p>
								<div className="mb-20 2k:mb-32 text-xl 2k:text-3xl">
									<Editor editorState={buildDesc} readOnly={true} toolbarHidden={true} />
								</div>

								{/* Buttons */}
								<div className="flex flex-col md:flex-row place-content-between">
									<div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-10">
										{loadedBuild.build ? <Button color="btn-primary" icon="export" onClick={copyBuildToClipboard} text="Export to KSP 2" /> : <Button text="Build not found!" color="btn-error" icon="cancel" />}
										<Button text="How to import into KSP" color="bg-base-900" htmlFor="how-to-paste-build-modal" icon="info" />
										<Button htmlFor="report-modal" color="btn-error" icon="report" text="Report" onClick={handleSetReport} />
									</div>
									{!authLoading && (user?.uid === loadedBuild.uid || user?.siteAdmin) && (
										<div className="flex flex-row flex-wrap gap-4">
											<Button text="Edit Build" icon="edit" color="btn-info" onClick={() => setEditingBuild(loadedBuild)} />
											<Button htmlFor="delete-build-modal" color="btn-error" icon="delete" text="Delete Build" />
										</div>
									)}
								</div>

								<div className="mb-6">{loadedBuild.video && <iframe src={youtubeLinkConverter(loadedBuild.video)}></iframe>}</div>

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
												{comments.map((comment, i) => {
													return <Comment key={comment.id} comment={comment} />;
												})}
											</div>
										)}
									</>
								)}
								{!authLoading && user?.username && (
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
				{loadedBuild && user?.siteAdmin && <MakeBuildOfTheWeekModal />}
			</MiddleContainer>
		</>
	);
}

export default Build;
