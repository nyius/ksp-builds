import React from 'react';
import { GiCancel } from 'react-icons/gi';
import { ImCloudUpload } from 'react-icons/im';
import { FaSave, FaUserAstronaut, FaCogs, FaHome } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { TiExport, TiPlusOutline } from 'react-icons/ti';
import { RiDeleteBin2Fill, RiEditFill, RiLoginCircleLine } from 'react-icons/ri';
import { BsFillPatchQuestionFill, BsFillArrowDownSquareFill, BsFillArrowLeftSquareFill, BsFillArrowRightSquareFill } from 'react-icons/bs';
import { BiCommentAdd, BiReset } from 'react-icons/bi';
import { MdOutlineDoneOutline, MdEmail, MdSettingsInputComponent } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { HiNewspaper } from 'react-icons/hi';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { Link } from 'react-router-dom';

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
 * @param {*} htmlFor - enter this if used to ope a modal
 * @param {*} margin - enter any margin
 * @param {*} href - href if its a link to a page (like profile, settings)
 * @param {*} type - enter 'submit' for submitting a form, 'button' to make it not submit, 'ahref' for a link to a page for google, leave blank for 'label'
 * @returns
 */
function Button({ text, onClick, color, size, icon, css, style, position, htmlFor, margin, type, href }) {
	const buttonIcon = () => {
		if (icon === 'cancel') return <GiCancel />;
		if (icon === 'upload') return <ImCloudUpload />;
		if (icon === 'save') return <FaSave />;
		if (icon === 'export') return <TiExport />;
		if (icon === 'delete') return <RiDeleteBin2Fill />;
		if (icon === 'edit') return <RiEditFill />;
		if (icon === 'help') return <BsFillPatchQuestionFill />;
		if (icon === 'comment') return <BiCommentAdd />;
		if (icon === 'plus') return <TiPlusOutline />;
		if (icon === 'done') return <MdOutlineDoneOutline />;
		if (icon === 'login') return <RiLoginCircleLine />;
		if (icon === 'logout') return <FiLogOut />;
		if (icon === 'google') return <FcGoogle />;
		if (icon === 'reset') return <BiReset />;
		if (icon === 'down') return <BsFillArrowDownSquareFill />;
		if (icon === 'left') return <BsFillArrowLeftSquareFill />;
		if (icon === 'right') return <BsFillArrowRightSquareFill />;
		if (icon === 'email') return <MdEmail />;
		if (icon === 'head') return <FaUserAstronaut />;
		if (icon === 'settings') return <MdSettingsInputComponent />;
		if (icon === 'home') return <FaHome />;
		if (icon === 'news') return <HiNewspaper />;
		if (icon === 'fill-heart') return <AiFillHeart />;
		if (icon === 'outline-heart') return <AiOutlineHeart />;
	};

	// The button is a label becuase then we can use htmlFor tag to open modals. Not sure if this breaks things but it seems to work fine
	if (type) {
		if (type === 'ahref') {
			return (
				<Link to={href} className={`btn 2k:btn-lg 2k:text-2xl ${style && style} ${color && color} ${css && css} ${size && size} ${position && position} ${margin && margin} `} onClick={onClick}>
					{icon && <span className={`text-2xl 2k:text-4xl ${text && 'mr-4 2k:mr-6'}`}>{buttonIcon()}</span>}
					{text !== '' && text}
				</Link>
			);
		} else {
			return (
				<button type={type} className={`btn 2k:btn-lg 2k:text-2xl ${style && style} ${color && color} ${css && css} ${size && size} ${position && position} ${margin && margin} `} onClick={onClick}>
					{icon && <span className={`text-2xl 2k:text-4xl ${text && 'mr-4 2k:mr-6'}`}>{buttonIcon()}</span>}
					{text !== '' && text}
				</button>
			);
		}
	} else {
		return (
			<label type={type} htmlFor={htmlFor} className={`btn 2k:btn-lg 2k:text-2xl ${style && style} ${color && color} ${css && css} ${size && size} ${position && position} ${margin && margin} `} onClick={onClick}>
				{icon && <span className={`text-2xl 2k:text-4xl ${text && 'mr-4 2k:mr-6'}`}>{buttonIcon()}</span>}
				{text !== '' && text}
			</label>
		);
	}
}

export default Button;
