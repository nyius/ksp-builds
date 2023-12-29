import React from 'react';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import { useHangarContext } from '../../context/hangars/HangarContext';
import { setHangarLimitModal } from '../../context/hangars/HangarActions';
import AstrobiffHeart from '../../assets/astrobiff-heart.png';
import Tier1Badge from '../../assets/badges/tier1/tier1_badge36.png';
import Tier2Badge from '../../assets/badges/tier2/tier2_badge36.png';
import Tier3Badge from '../../assets/badges/tier3/tier3_badge36.png';
import { setSubscribeModal } from '../../context/auth/AuthActions';
import { useAuthContext } from '../../context/auth/AuthContext';

function HangarLimitModal() {
	const { hangarLimitModal, dispatchHangars } = useHangarContext();
	const { dispatchAuth } = useAuthContext();

	if (hangarLimitModal) {
		return (
			<>
				<input type="checkbox" id="hangar-limit-modal" checked={true} className="modal-toggle" />
				<div className="modal">
					<div className="modal-box relative">
						<Button onClick={() => setHangarLimitModal(dispatchHangars, false)} style="btn-circle" size="absolute right-2 top-2 z-50" text="X" />
						<PlanetHeader text="Hangar limit reached" />

						<div className="flex flex-col flex-wrap gap-4 2k:gap-8 justify-center items-center mt-2 mb-16 w-full">
							<img src={AstrobiffHeart} alt="Astrobiff" className="rounded-xl mb-3 2k:mb-6" />
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
							<p className="text-xl 2k:text-2xl text-slate-200">Subscribe to support KSP Builds and create up to 20 hangars + other perks and benefits</p>
						</div>
						<div className="flex flex-wrap gap-4 2k:gap-8 justify-center align-center mt-2 w-full">
							<Button
								text="Susbcribe"
								onClick={() => {
									setHangarLimitModal(dispatchHangars, false);
									setSubscribeModal(dispatchAuth, true);
								}}
								icon="outline-star"
								color="btn-success"
								htmlFor="subscribe-modal"
							/>
							<Button text="Cancel" color="btn-error" onClick={() => setHangarLimitModal(dispatchHangars, false)} />
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default HangarLimitModal;
