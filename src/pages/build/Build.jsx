import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillEye } from 'react-icons/ai';
import { TiExport } from 'react-icons/ti';
import { RiDeleteBin2Fill, RiEditFill } from 'react-icons/ri';
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
							{/* Image */}
							<div className="build-img rounded-xl w-full bg-cover bg-center bg-no-repeat bg-base-900" style={{ backgroundImage: `url('${loadedBuild.image}')` }}></div>

							<div className="flex flex-row place-content-between">
								{/* Name */}
								<h1 className="text-slate-200 text-2xl font-bold">{loadedBuild.name}</h1>
								<p className="flex flex-row text-2xl items-center gap-4">
									<AiFillEye />
									<span className="text-lg self-end"> {loadedBuild.views}</span>
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
							<p className="mb-4">{loadedBuild.description}</p>

							{/* Buttons */}
							<div className="flex flex-row place-content-between">
								<div className="flex flex-row gap-4 mb-10">
									<button className="btn btn-primary w-fit items-center" onClick={copyBuildToClipboard}>
										<span className="mr-2 text-2xl">
											<TiExport />
										</span>
										Export to KSP 2
									</button>
									<label className="btn bg-base-900" htmlFor="how-to-paste-build-modal">
										How ?
									</label>
								</div>
								{!authLoading && (user?.uid === loadedBuild.uid || user?.siteAdmin) && (
									<div className="flex flex-row gap-4">
										<button className="btn btn-info gap-2">
											<span className="text-2xl">
												<RiEditFill />
											</span>
											Edit Build
										</button>
										<label htmlFor="delete-build-modal" className="btn btn-error gap-2">
											<span className="text-2xl">
												<RiDeleteBin2Fill />
											</span>
											Delete Build
										</label>
									</div>
								)}
							</div>

							{/* ----------------- Comments ---------------------- */}
							<p className="text-2xl">Comments</p>
							{!authLoading && user?.username && (
								<>
									<textarea onChange={e => setComment(e.target.value)} maxLength="3000" name="" id="" placeholder="Leave a comment" rows="2" className="textarea"></textarea>
									<button onClick={addComment} className="btn bg-base-900 w-fit">
										Save
									</button>
								</>
							)}
							{commentsLoading ? (
								<Spinner1 />
							) : (
								<>
									{comments.length === 0 ? (
										<p>No comments yet! Be the first to leave one</p>
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
