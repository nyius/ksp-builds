import React from 'react';
import Button from '../../components/buttons/Button';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import Helmet from '../../components/Helmet/Helmet';
import FaqCard from './Components/FaqCard';
//---------------------------------------------------------------------------------------------------//
import HowToUpload from './Components/faqAnswers/HowToUpload';
import HowToImport from './Components/faqAnswers/HowToImport';
import PrivateUpload from './Components/faqAnswers/PrivateUpload';
import ChallengeSubmit from './Components/faqAnswers/ChallengeSubmit';
import KSPBuildsFree from './Components/faqAnswers/KSPBuildsFree';
import HowManyPeople from './Components/faqAnswers/HowManyPeople';
import HowToShare from './Components/faqAnswers/HowToShare';
import HowToDelete from './Components/faqAnswers/HowToDelete';
import HowToEditBuild from './Components/faqAnswers/HowToEditBuild';
import Hiring from './Components/faqAnswers/Hiring';
import WhoRunsKSPB from './Components/faqAnswers/WhoRunsKSPB';

/**
 * Page for displaying FAQ
 * @returns
 */
function Faq() {
	return (
		<MiddleContainer>
			<Helmet title="F.A.Q" pageLink="https://kspbuilds.com/faq" />

			<PlanetHeader text="F.A.Q" />

			<div className="text-xl 2k:text-3xl mb-6 2k:mb-12 text-slate-200">Here you'll find some answers to commonly asked questions</div>
			<div className="text-xl 2k:text-3xl text-slate-200">Build Questions</div>
			<div className="join join-vertical w-full mb-10 2k:mb-15">
				<FaqCard title="How do I upload a build?">
					<HowToUpload />
				</FaqCard>

				<FaqCard title="How do I import a build into KSP2?">
					<HowToImport />
				</FaqCard>

				<FaqCard title="How do I edit my uploaded build?">
					<HowToEditBuild />
				</FaqCard>

				<FaqCard title="How do I delete an uploaded build?">
					<HowToDelete />
				</FaqCard>

				<FaqCard title="Can I make a build private?">
					<PrivateUpload />
				</FaqCard>

				<FaqCard title="How can I share my uploaded build?">
					<HowToShare />
				</FaqCard>

				<FaqCard title="How can I submit a build for a challenge?">
					<ChallengeSubmit />
				</FaqCard>
			</div>

			<div className="text-xl 2k:text-3xl text-slate-200">Misc Questions</div>
			<div className="join join-vertical w-full mb-10 2k:mb-15">
				<FaqCard title="Is KSP Builds Free?">
					<KSPBuildsFree />
				</FaqCard>

				<FaqCard title="How many people run KSP Builds?">
					<HowManyPeople />
				</FaqCard>

				<FaqCard title="Is KSP Builds Hiring?">
					<Hiring />
				</FaqCard>

				<FaqCard title="Is KSP Builds owned by Intercept Games?">
					<WhoRunsKSPB />
				</FaqCard>
			</div>
		</MiddleContainer>
	);
}

export default Faq;
