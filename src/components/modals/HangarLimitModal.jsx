import React from 'react';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import { useHangarContext } from '../../context/hangars/HangarContext';
import { setHangarLimitModal } from '../../context/hangars/HangarActions';
import AstrobiffHeart from '../../assets/astrobiff-heart.png';
import { setSubscribeModal } from '../../context/auth/AuthActions';
import { useAuthContext } from '../../context/auth/AuthContext';
import T1Badge from '../badges/T1Badge';
import T2Badge from '../badges/T2Badge';
import T3Badge from '../badges/T3Badge';

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
								<T1Badge />

								<T2Badge />

								<T3Badge />
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
