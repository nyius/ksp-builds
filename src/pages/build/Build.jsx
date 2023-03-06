import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillEye } from 'react-icons/ai';
import { TiExport } from 'react-icons/ti';
import { RiDeleteBin2Fill, RiEditFill } from 'react-icons/ri';
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
//---------------------------------------------------------------------------------------------------//

function Build() {
	const { loadingBuild, loadedBuild, commentsLoading, comments } = useContext(BuildContext);
	const { user, authLoading } = useContext(AuthContext);
	const { fetchBuild, setComment, addComment } = useBuild();

	const { id } = useParams();

	useEffect(() => {
		fetchBuild(id);
	}, []);

	/**
	 * Handles copying the build to the clipboard
	 */
	const copyBuildToClipboard = () => {
		navigator.clipboard.writeText(loadedBuild.build);
		toast.success('Build coped to clipboard!');
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-row bg-base-400 w-full rounded-xl p-6">
			{loadingBuild ? (
				<Spinner1 />
			) : (
				<>
					{loadedBuild ? (
						<div className="flex flex-col gap-4 w-full">
							{/* Images */}
							<Carousel images={loadedBuild.images} />

							<div className="flex flex-row place-content-between">
								{/* Name */}
								<h1 className="text-slate-200 text-2xl font-bold 2k:text-4xl">{loadedBuild.name}</h1>
								<p className="flex flex-row text-2xl items-center gap-4 2k:text-4xl">
									<AiFillEye />
									<span className="text-lg self-end 2k:text-3xl"> {loadedBuild.views}</span>
								</p>
							</div>

							<div className="flex flex-row place-content-between mb-4">
								{/* Voting/Views */}
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
							<p className="mb-4 2k:mb-10 2k:text-3xl">{loadedBuild.description}</p>

							{/* Buttons */}
							<div className="flex flex-col md:flex-row place-content-between">
								<div className="flex flex-ro flex-wrap gap-4 mb-10">
									<button className="btn 2k:btn-lg 2k:text-2xl btn-primary w-fit items-center" onClick={copyBuildToClipboard}>
										<span className="mr-2 text-2xl 2k:text-4xl">
											<TiExport />
										</span>
										Export to KSP 2
									</button>
									<label className="btn 2k:btn-lg 2k:text-2xl bg-base-900" htmlFor="how-to-paste-build-modal">
										How to import into KSP
									</label>
								</div>
								{!authLoading && (user?.uid === loadedBuild.uid || user?.siteAdmin) && (
									<div className="flex flex-row flex-wrap gap-4">
										<button className="btn 2k:btn-lg 2k:text-2xl btn-info gap-2">
											<span className="text-2xl">
												<RiEditFill />
											</span>
											Edit Build
										</button>
										<label htmlFor="delete-build-modal" className="btn 2k:btn-lg 2k:text-2xl btn-error gap-2">
											<span className="text-2xl">
												<RiDeleteBin2Fill />
											</span>
											Delete Build
										</label>
									</div>
								)}
							</div>

							<div className="mb-6">{loadedBuild.video && <iframe src={youtubeLinkConverter(loadedBuild.video)}></iframe>}</div>

							{/* ----------------- Comments ---------------------- */}
							<p className="text-2xl 2k:text-3xl">Comments</p>
							{!authLoading && user?.username && (
								<>
									<textarea onChange={e => setComment(e.target.value)} maxLength="3000" name="" id="" placeholder="Leave a comment" rows="2" className="textarea 2k:text-2xl"></textarea>
									<button onClick={addComment} className="btn 2k:btn-lg 2k:text-2xl bg-base-900 w-fit 2k:mb-8">
										Save
									</button>
								</>
							)}
							{commentsLoading ? (
								<Spinner1 />
							) : (
								<>
									{comments.length === 0 ? (
										<p className="2k:btn-lg 2k:text-2xl">No comments yet! Be the first to leave one</p>
									) : (
										<div className="flex flex-col gap-4">
											{comments.map((comment, i) => {
												return <Comment key={i} comment={comment} />;
											})}
										</div>
									)}
								</>
							)}
						</div>
					) : (
						<div className="flex flex-col gap-4">
							<h1 className="text-slate-200 text-2xl font-bold">Build not found! :(</h1>
							<h1 className="text-slate-200 text-xl">Check the URL to see if something was typed wrong, or maybe this build was deleted</h1>
						</div>
					)}
				</>
			)}
			<HowToPasteBuildModal />
			{loadedBuild && <DeleteBuildModal id={loadedBuild.id} />}
		</div>
	);
}

export default Build;
