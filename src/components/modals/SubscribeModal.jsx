import React, { useContext } from 'react';
import Button from '../buttons/Button';
import AstrobiffHeart from '../../assets/astrobiff-heart.png';
import Tier1Badge from '../../assets/badges/tier1/tier1_badge36.png';
import Tier2Badge from '../../assets/badges/tier2/tier2_badge36.png';
import Tier3Badge from '../../assets/badges/tier3/tier3_badge36.png';
import AuthContext from '../../context/auth/AuthContext';
import useAuth from '../../context/auth/AuthActions';
import { FaHeart } from 'react-icons/fa';

function SubscribeModal({ id, userID }) {
	const { user, authLoading, newSub } = useContext(AuthContext);
	const { setNewSub } = useAuth();

	return (
		<>
			{!authLoading && user?.username && (
				<>
					<input type="checkbox" id="subscribe-modal" className="modal-toggle" />
					<div className="modal">
						<div className="modal-box relative">
							<Button htmlFor="subscribe-modal" style="btn-circle" position="absolute right-2 top-2" text="X" onClick={setNewSub} />
							<h3 className="text-xl 2k:text-3xl font-bold text-center mb-4 2k:mb-6 text-white">Subscribe</h3>
							<img src={AstrobiffHeart} alt="Astrobiff" className="rounded-xl mb-3 2k:mb-6" />

							{newSub ? (
								<h4 className="text-3xl 2k:text-4xl flex flex-col items-center justify-center gap-2 2k:gap-4 text-center text-white my-10 2k:my-14">
									Thank you for subscribing!
									<span className="text-secondary">
										<FaHeart />
									</span>
									Stary enjoying your new perks immediately{' '}
								</h4>
							) : (
								<>
									<div className="p-4 2k:p-8 bg-base-800 rounded-xl border border-2 border-slate-600 border-dashed mb-8 2k:mb-16 ">
										<h4 className="text-xl 2k:text-3xl text-center text-white">Support every month by Subscribing to help keep KSP Builds running.</h4>
									</div>

									<h4 className="text-xl 2k:text-3xl font-bold text-white mb-10 2k:mb-14">As a KSP Builds Supporter you'll get:</h4>
									<h4 className="text-xl 2k:text-3xl text-white mb-4 2k:mb-8">• A special badge next to your username</h4>
									<div className="flex flex-row flex-wrap gap-5 2k:gap-10 mb-10 2k:mb-14 text-xl 2k:text-3xl font-bold rounded-xl p-3 bg-base-600">
										<div className="tooltip" data-tip="Tier 1 badge">
											<div className="text-primary flex flex-row gap-2 items-center">
												Tier 1
												<span>
													<img className="w-8 h-8 2k:w-12 2k:h-12" src={Tier1Badge} alt="tier 1 badge" />
												</span>
											</div>
										</div>

										<div className="tooltip" data-tip="Tier 2 badge">
											<div className="text-secondary flex flex-row gap-2 items-center">
												Tier 2
												<span>
													<img className="w-8 h-8 2k:w-12 2k:h-12" src={Tier2Badge} alt="tier 2 badge" />
												</span>
											</div>
										</div>

										<div className="tooltip" data-tip="Tier 3 badge">
											<div className="text-accent flex flex-row gap-2 items-center">
												Tier 3
												<span>
													<img className="w-8 h-8 2k:w-12 2k:h-12" src={Tier3Badge} alt="tier 3 badge" />
												</span>
											</div>
										</div>
									</div>
									<h4 className="text-xl 2k:text-3xl text-white mb-3 2k:mb-6">• Custom username color</h4>
									<div className="flex flex-row flex-wrap gap-4 2k:gap-8 mb-8 2k:mb-12 text-xl 2k:text-2xl font-bold bg-base-600 p-3 rounded-xl">
										<p className="text-primary">Username</p>
										<p className="text-secondary">Username</p>
										<p className="text-accent">Username</p>
									</div>
									<h4 className="text-xl 2k:text-3xl text-white mb-8 2k:mb-12">• Support an amazing community of space enthusiasts</h4>
									<h4 className="text-xl 2k:text-3xl text-white mb-8 2k:mb-12">And many new features being worked on!</h4>

									<div className="divider"></div>

									<div className="flex flex-col gap-4 2k:gap-8">
										<div className="text-3xl 2k:text-4xl text-slate-300 font-bold mb-4 2k:mb-8">Tiers</div>
										<div className="flex flex-row items-center">
											<Button
												type="ahref"
												href={process.env.REACT_APP_ENV === 'DEV' ? `${process.env.REACT_APP_TIER1_DEV_LINK}?client_reference_id=${user?.uid}` : `${process.env.REACT_APP_TIER1_PROD_LINK}?client_reference_id=${user?.uid}`}
												target="blank"
												color="btn-primary"
												text="Subscribe Tier 1"
												icon="tier1"
												size="w-3/4"
											/>
											<p className="text-lg 2k:text-2xl text-white font-bold bg-base-500 rounded-xl flex items-center justify-center w-full px-6 2k:px-8 h-12 2k:h-16">US$3.66</p>
										</div>
										<div className="flex flex-row items-center">
											<Button
												type="ahref"
												href={process.env.REACT_APP_ENV === 'DEV' ? `${process.env.REACT_APP_TIER2_DEV_LINK}?client_reference_id=${user?.uid}` : `${process.env.REACT_APP_TIER2_PROD_LINK}?client_reference_id=${user?.uid}`}
												target="blank"
												color="btn-secondary"
												text="Subscribe Tier 2"
												icon="tier2"
												size="w-3/4"
											/>
											<p className="text-lg 2k:text-2xl text-white font-bold bg-base-500 rounded-xl flex items-center justify-center w-full px-6 2k:px-8 h-12 2k:h-16">US$7.33</p>
										</div>
										<div className="flex flex-row items-center">
											<Button
												type="ahref"
												href={process.env.REACT_APP_ENV === 'DEV' ? `${process.env.REACT_APP_TIER3_DEV_LINK}?client_reference_id=${user?.uid}` : `${process.env.REACT_APP_TIER3_PROD_LINK}?client_reference_id=${user?.uid}`}
												target="blank"
												color="btn-accent"
												text="Subscribe Tier 3"
												icon="tier3"
												size="w-3/4"
											/>
											<p className="text-lg 2k:text-2xl text-white font-bold bg-base-500 rounded-xl text-center w-full flex justify-center items-center px-6 2k:px-8 h-12 2k:h-16">US$14.68</p>
										</div>
									</div>

									<div className="flex flex-row items-center justify-end gap-4 2k:gap-10 mt-10">
										<Button htmlFor="subscribe-modal" color="btn-ghost" text="Cancel" icon="cancel" onClick={setNewSub} />
									</div>
								</>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
}

export default SubscribeModal;
