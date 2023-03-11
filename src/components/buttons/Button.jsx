import React from 'react';
import { GiCancel } from 'react-icons/gi';
import { ImCloudUpload } from 'react-icons/im';
import { FaSave, FaUserAstronaut, FaCogs, FaHome } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { TiExport, TiPlusOutline } from 'react-icons/ti';
import { RiDeleteBin2Fill, RiEditFill, RiLoginCircleLine } from 'react-icons/ri';
import { BsFillPatchQuestionFill, BsFillArrowDownSquareFill, BsFillArrowLeftSquareFill } from 'react-icons/bs';
import { BiCommentAdd, BiReset } from 'react-icons/bi';
import { MdOutlineDoneOutline, MdEmail, MdSettingsInputComponent } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { HiNewspaper } from 'react-icons/hi';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

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
 * @param {*} type - enter 'submit' for submitting a form, 'button' to make it not submit
 * @returns
 */
function Button({ text, onClick, color, size, icon, css, style, position, htmlFor, margin, type }) {
	// The button is a label becuase then we can use htmlFor tag to open modals. Not sure if this breaks things but it seems to work fine
	if (type) {
		return (
			<button type={type} className={`btn 2k:btn-lg 2k:text-2xl ${style && style} ${color && color} ${css && css} ${size && size} ${position && position} ${margin && margin} `} onClick={onClick}>
				{icon && (
					<span className={`text-2xl 2k:text-4xl ${text && 'mr-4 2k:mr-6'}`}>
						{icon === 'cancel' && <GiCancel />}
						{icon === 'upload' && <ImCloudUpload />}
						{icon === 'save' && <FaSave />}
						{icon === 'export' && <TiExport />}
						{icon === 'delete' && <RiDeleteBin2Fill />}
						{icon === 'edit' && <RiEditFill />}
						{icon === 'help' && <BsFillPatchQuestionFill />}
						{icon === 'comment' && <BiCommentAdd />}
						{icon === 'plus' && <TiPlusOutline />}
						{icon === 'done' && <MdOutlineDoneOutline />}
						{icon === 'login' && <RiLoginCircleLine />}
						{icon === 'logout' && <FiLogOut />}
						{icon === 'google' && <FcGoogle />}
						{icon === 'reset' && <BiReset />}
						{icon === 'down' && <BsFillArrowDownSquareFill />}
						{icon === 'left' && <BsFillArrowLeftSquareFill />}
						{icon === 'email' && <MdEmail />}
						{icon === 'head' && <FaUserAstronaut />}
						{icon === 'settings' && <MdSettingsInputComponent />}
						{icon === 'home' && <FaHome />}
						{icon === 'news' && <HiNewspaper />}
						{icon === 'fill-heart' && <AiFillHeart />}
						{icon === 'outline-heart' && <AiOutlineHeart />}
					</span>
				)}
				{text !== '' && text}
			</button>
		);
	} else {
		return (
			<label type={type} htmlFor={htmlFor} className={`btn 2k:btn-lg 2k:text-2xl ${style && style} ${color && color} ${css && css} ${size && size} ${position && position} ${margin && margin} `} onClick={onClick}>
				{icon && (
					<span className={`text-2xl 2k:text-4xl ${text && 'mr-4 2k:mr-6'}`}>
						{icon === 'cancel' && <GiCancel />}
						{icon === 'upload' && <ImCloudUpload />}
						{icon === 'save' && <FaSave />}
						{icon === 'export' && <TiExport />}
						{icon === 'delete' && <RiDeleteBin2Fill />}
						{icon === 'edit' && <RiEditFill />}
						{icon === 'help' && <BsFillPatchQuestionFill />}
						{icon === 'comment' && <BiCommentAdd />}
						{icon === 'plus' && <TiPlusOutline />}
						{icon === 'done' && <MdOutlineDoneOutline />}
						{icon === 'login' && <RiLoginCircleLine />}
						{icon === 'logout' && <FiLogOut />}
						{icon === 'google' && <FcGoogle />}
						{icon === 'reset' && <BiReset />}
						{icon === 'down' && <BsFillArrowDownSquareFill />}
						{icon === 'left' && <BsFillArrowLeftSquareFill />}
						{icon === 'email' && <MdEmail />}
						{icon === 'head' && <FaUserAstronaut />}
						{icon === 'settings' && <MdSettingsInputComponent />}
						{icon === 'home' && <FaHome />}
						{icon === 'news' && <HiNewspaper />}
						{icon === 'fill-heart' && <AiFillHeart />}
						{icon === 'outline-heart' && <AiOutlineHeart />}
					</span>
				)}
				{text !== '' && text}
			</label>
		);
	}
}

export default Button;
