import React from 'react';
import { GiCancel, GiPeaks } from 'react-icons/gi';
import { ImCloudUpload } from 'react-icons/im';
import { FaSave, FaUserAstronaut, FaCogs, FaHome, FaList } from 'react-icons/fa';
import { FiLogOut, FiShare2 } from 'react-icons/fi';
import { TiExport, TiPlusOutline } from 'react-icons/ti';
import { RiDeleteBin2Fill, RiEditFill, RiLoginCircleLine } from 'react-icons/ri';
import { BsFillPatchQuestionFill, BsFillArrowDownSquareFill, BsGrid, BsFillArrowLeftSquareFill, BsFillArrowRightSquareFill, BsCaretRightFill, BsCaretLeftFill, BsCaretDownFill, BsTwitter, BsCaretUpFill } from 'react-icons/bs';
import { BiCommentAdd, BiReset, BiMessageAltDetail } from 'react-icons/bi';
import { MdOutlineDoneOutline, MdEmail, MdSettingsInputComponent, MdReport } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { HiNewspaper, HiChevronDoubleDown } from 'react-icons/hi';
import { AiOutlineHeart, AiFillHeart, AiOutlineBulb, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Tier1Badge from '../../assets/badges/tier1/tier1_badge36.png';
import Tier2Badge from '../../assets/badges/tier2/tier2_badge36.png';
import Tier3Badge from '../../assets/badges/tier3/tier3_badge36.png';

/**
 *
 * @param {*} text - The text to display in the button
 * @param {*} onClick - function to execute on click
 * @param {*} color - input daisyui/tailwin colors (btn-primary, etc)
 * @param {*} size - any sizing (btn-sm, btn-lg, w-full, etc)
 * @param {*} icon - cancel, save, delete
 * @param {*} css - any extra inline tailwind/diasyui styling
 * @param {*} style - eg btn-circle
 * @param {*} position - used for absolute
 * @param {*} tooltip - text for tooltip
 * @param {*} htmlFor - enter this if used to ope a modal
 * @param {*} margin - enter any margin
 * @param {*} href - href if its a link to a page (like profile, settings)
 * @param {*} target - set to _blank if want button click to open in new tab
 * @param {*} tabIndex - set a numerical tabIndex number to use for things like dropdowns
 * @param {*} type - enter 'submit' for submitting a form, 'button' to make it not submit, 'ahref' for a link to a page for google, leave blank for 'label'
 * @returns
 */
function Button({ text, onClick, color, size, icon, css, style, position, htmlFor, margin, type, href, target, tabIndex, tooltip }) {
	const buttonIcon = () => {
		if (icon === 'cancel') return <GiCancel />;
		if (icon === 'upload') return <ImCloudUpload />;
		if (icon === 'save') return <FaSave />;
		if (icon === 'export') return <TiExport />;
		if (icon === 'delete') return <RiDeleteBin2Fill />;
		if (icon === 'edit') return <RiEditFill />;
		if (icon === 'help') return <BsFillPatchQuestionFill />;
		if (icon === 'comment') return <BiCommentAdd />;
		if (icon === 'grid') return <BsGrid />;
		if (icon === 'list') return <FaList />;
		if (icon === 'plus') return <TiPlusOutline />;
		if (icon === 'done') return <MdOutlineDoneOutline />;
		if (icon === 'login') return <RiLoginCircleLine />;
		if (icon === 'logout') return <FiLogOut />;
		if (icon === 'google') return <FcGoogle />;
		if (icon === 'reset') return <BiReset />;
		if (icon === 'down') return <BsFillArrowDownSquareFill />;
		if (icon === 'down2') return <BsCaretDownFill />;
		if (icon === 'chevron-down') return <HiChevronDoubleDown />;
		if (icon === 'left') return <BsFillArrowLeftSquareFill />;
		if (icon === 'left2') return <BsCaretLeftFill />;
		if (icon === 'right') return <BsFillArrowRightSquareFill />;
		if (icon === 'right2') return <BsCaretRightFill />;
		if (icon === 'up2') return <BsCaretUpFill />;
		if (icon === 'email') return <MdEmail />;
		if (icon === 'head') return <FaUserAstronaut />;
		if (icon === 'settings') return <MdSettingsInputComponent />;
		if (icon === 'home') return <FaHome />;
		if (icon === 'news') return <HiNewspaper />;
		if (icon === 'fill-heart') return <AiFillHeart />;
		if (icon === 'outline-heart') return <AiOutlineHeart />;
		if (icon === 'report') return <MdReport />;
		if (icon === 'share') return <FiShare2 />;
		if (icon === 'info') return <AiOutlineBulb />;
		if (icon === 'mountain') return <GiPeaks />;
		if (icon === 'twitter') return <BsTwitter />;
		if (icon === 'message') return <BiCommentAdd />;
		if (icon === 'fill-star') return <AiFillStar />;
		if (icon === 'outline-star') return <AiOutlineStar />;
		if (icon === 'tier1') return <img src={Tier1Badge} alt="" className="w-8 h-8 2k:w-12 2k:h-12" />;
		if (icon === 'tier2') return <img src={Tier2Badge} alt="" className="w-8 h-8 2k:w-12 2k:h-12" />;
		if (icon === 'tier3') return <img src={Tier3Badge} alt="" className="w-8 h-8 2k:w-12 2k:h-12" />;
	};

	// The button is a label becuase then we can use htmlFor tag to open modals. Not sure if this breaks things but it seems to work fine
	if (type) {
		if (type === 'ahref') {
			return (
				<div className={`${tooltip ? 'tooltip' : ''} ${size && size}`} data-tip={tooltip ? tooltip : ''}>
					<Link to={href} target={target} className={`btn 2k:btn-lg 2k:text-xl ${style && style} ${color && color} ${css && css} ${size && size} ${position && position} ${margin && margin} `} onClick={onClick}>
						{icon && <span className={`text-2xl 2k:text-3xl ${text && 'mr-4 2k:mr-6'}`}>{buttonIcon()}</span>}
						{text !== '' && text}
					</Link>
				</div>
			);
		} else {
			return (
				<div className={`${tooltip ? 'tooltip' : ''} ${size && size}`} data-tip={tooltip ? tooltip : ''}>
					<button type={type} className={`btn 2k:btn-lg 2k:text-xl ${style && style} ${color && color} ${css && css} ${size && size} ${position && position} ${margin && margin} `} onClick={onClick}>
						{icon && <span className={`text-2xl 2k:text-3xl ${text && 'mr-4 2k:mr-6'}`}>{buttonIcon()}</span>}
						{text !== '' && text}
					</button>
				</div>
			);
		}
	} else {
		return (
			<div className={`${tooltip ? 'tooltip' : ''} ${size && size} ${position && position}`} data-tip={tooltip ? tooltip : ''}>
				<label type={type} tabIndex={tabIndex} htmlFor={htmlFor} className={`btn 2k:btn-lg 2k:text-xl ${style && style} ${color && color} ${css && css} ${size && size} ${position && position} ${margin && margin} `} onClick={onClick}>
					{icon && <span className={`text-2xl 2k:text-3xl ${text && 'mr-4 2k:mr-6'}`}>{buttonIcon()}</span>}
					{text !== '' && text}
				</label>
			</div>
		);
	}
}

export default Button;
