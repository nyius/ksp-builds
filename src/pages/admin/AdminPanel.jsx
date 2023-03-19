import React, { useEffect, useState, useContext } from 'react';
import { doc, deleteDoc, getDocs, query, collection, orderBy, updateDoc, getDoc, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { cloneDeep } from 'lodash';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import useAuth from '../../context/auth/AuthActions';
//---------------------------------------------------------------------------------------------------//
import standardNotifications from '../../utilities/standardNotifications';
//---------------------------------------------------------------------------------------------------//
import TextInput from '../../components/input/TextInput';
import Button from '../../components/buttons/Button';
import Spinner1 from '../../components/spinners/Spinner1';
import TextEditor from '../../components/textEditor/TextEditor';
import PlanetHeader from '../../components/header/PlanetHeader';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';

function AdminPanel() {
	const { user } = useContext(AuthContext);
	const { sendNotification } = useAuth();
	//---------------------------------------------------------------------------------------------------//
	const [reportRepliedFilter, setReportRepliedFilter] = useState(false);
	const [messagesLoading, setMessagesLoading] = useState(true);
	const [replying, setReplying] = useState({ uid: '', i: '' });
	const [siteNotification, setSiteNotification] = useState('');
	const [sortedReports, setSortedReports] = useState([]);
	const [statsLoading, setStatsLoading] = useState(true);
	const [infoLoading, setInfoLoading] = useState(true);
	const [replyMessage, setReplyMessage] = useState('');
	const [newVersion, setNewVersion] = useState('');
	const [versions, setVersions] = useState([]);
	const [reports, setReports] = useState([]);
	const [stats, setStats] = useState(null);

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				let reportsData = [];
				const q = query(collection(db, 'reports'), orderBy('date', 'desc'));
				const reportsSnap = await getDocs(q);

				reportsSnap.forEach(report => {
					const reportData = report.data();
					reportData.id = report.id;
					reportsData.push(reportData);
				});

				setReports(reportsData);
				setMessagesLoading(false);
			} catch (error) {
				console.log(error);
			}
		};

		fetchMessages();

		const fetchKspInfo = async () => {
			try {
				const data = await getDoc(doc(db, 'kspInfo', 'info'));
				const dataParse = data.data();

				setVersions(dataParse.versions);
				setInfoLoading(false);
			} catch (error) {
				console.log(error);
			}
		};

		fetchKspInfo();

		const fetchAdminPanel = async () => {
			try {
				const bildsColl = collection(db, 'builds');
				const buildsSnap = await getCountFromServer(bildsColl);
				const usersCol = collection(db, 'users');
				const usersSap = await getCountFromServer(usersCol);

				setStats({ builds: buildsSnap.data().count, users: usersSap.data().count });
				setStatsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};

		fetchAdminPanel();
	}, []);

	const submitNewVersion = async () => {
		try {
			if (newVersion === '') {
				toast.error('No new version entered');
				return;
			}
			const newVersions = [newVersion, ...versions];
			await updateDoc(doc(db, 'kspInfo', 'info'), { versions: newVersions });
			toast.success('Version added!');
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		setSortedReports(prevState => {
			return reports.filter(report => {
				if (!reportRepliedFilter) return report;
				if (reportRepliedFilter && !report.replied) return report;
			});
		});
	}, [reports, reportRepliedFilter]);

	/**
	 * Handles deleting the report
	 * @param {*} id
	 */
	const deleteReport = async (id, i) => {
		try {
			await deleteDoc(doc(db, 'reports', id));
			setReports(prevState => {
				const newState = [...prevState];
				newState.splice(i, 1);
				return newState;
			});
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles replying to a report
	 */
	const replyToReport = async () => {
		try {
			// Handle nofitications
			const newNotif = { ...standardNotifications };
			newNotif.uid = user.uid;
			newNotif.username = user.username;
			newNotif.timestamp = new Date();
			newNotif.profilePicture = user.profilePicture;
			newNotif.message = replyMessage;
			newNotif.type = 'message';
			delete newNotif.buildId;
			delete newNotif.buildName;
			delete newNotif.comment;
			delete newNotif.commentId;

			await sendNotification(replying.uid, newNotif);
			await updateDoc(doc(db, 'reports', replying.id), { replied: true });

			setReports(prevState => {
				const newState = cloneDeep(prevState);
				newState[replying.i].replied = true;
				return newState;
			});

			handleClearReply();
			toast.success('Message sent!');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
		}
	};

	/**
	 * handles clearing a reply
	 */
	const handleClearReply = () => {
		setReplying({ uid: '', i: '' });
		setReplyMessage('');
	};

	/**
	 * Handles sending a message to everyone on the site
	 */
	const sendSiteMessage = async () => {
		try {
			if (siteNotification === '') {
				toast.error('Forgot a message');
				return;
			}

			const usersRef = collection(db, 'users');
			const usersSnap = await getDocs(usersRef);

			const newNotif = cloneDeep(standardNotifications);
			newNotif.uid = user.uid;
			newNotif.username = user.username;
			newNotif.timestamp = new Date();
			newNotif.profilePicture = user.profilePicture;
			newNotif.message = siteNotification;
			newNotif.type = 'message';
			delete newNotif.buildId;
			delete newNotif.buildName;
			delete newNotif.comment;
			delete newNotif.commentId;

			usersSnap.forEach(user => {
				sendNotification(user.id, newNotif);
			});
			toast.success('Message sent!');
		} catch (error) {
			console.log(error);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>KSP Builds - Admin Panel</title>
				<link rel="canonical" href={`https://kspbuilds.com/admin-panel`} />
			</Helmet>

			<MiddleContainer>
				<PlanetHeader text="Admin" />

				<div className="w-full rounded-xl bg-base-900 flex flex-row p-4 2k:p-8 mb-6 2k:mb-10">
					{statsLoading ? (
						<Spinner1 />
					) : (
						<>
							<div className="flex flex-col gap-4 2k:gap-8 p-4 2k:p-8">
								<div className="text-2xl 2k:text-4xl text-slate-400 font-bold">USERS</div>
								<div className="text-2xl 2k:text-4xl ">{stats.users}</div>
							</div>
							<div className="divider divider-horizontal"></div>
							<div className="flex flex-col gap-4 2k:gap-8 p-4 2k:p-8">
								<div className="text-2xl 2k:text-4xl text-slate-400 font-bold">BUILDS</div>
								<div className="text-2xl 2k:text-4xl ">{stats.builds}</div>
							</div>
						</>
					)}
				</div>

				{/* ------------------Versions------------------ */}
				{infoLoading ? (
					<Spinner1 />
				) : (
					<>
						<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Add a new KSP version</p>
						<TextInput onChange={e => setNewVersion(e.target.value)} placeholder="Version" size="w-44" />
						<Button text="submit" icon="upload" onClick={submitNewVersion} margin="mb-10 2k:mb-20" size="w-fit" color="btn-primary" />
					</>
				)}

				{/* ------------------ Site Notification ---------------------- */}
				<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Send Site-wide message</p>
				<TextEditor setState={setSiteNotification} />
				<Button text="send" color="btn-primary" icon="upload" size="w-fit" onClick={sendSiteMessage} />

				{/* ------------------ Reports---------------------- */}
				<div className="flex flex-row place-content-between mt-10 2k:mt-20">
					<p className="text-2xl 2k:text-4xl font-bold text-slate-200">Reports/Messages</p>
					<div className="flex flex-row gap-4">
						<p className="text-xl 2k:text-3xl">Hide Replied Reports</p>
						<input type="checkbox" className="checkbox checkbox-lg" onChange={() => setReportRepliedFilter(!reportRepliedFilter)} />
					</div>
				</div>
				<div className="flex flex-col gap-10">
					{messagesLoading ? (
						<Spinner1 />
					) : (
						<>
							{reports.length === 0 && <p className="text-2xl 2k:text-4xl font-bold mb-10 2k:mb-20">No Reports</p>}
							{sortedReports.map((report, i) => {
								return (
									<div key={i} className="flex flex-col w-full h-fit p-5 2k:p-10 bg-base-200 gap-10 rounded-xl relative">
										{/* Replied badge */}
										<div className="absolute right-2 top-2">
											<div className={`alert ${report.replied ? 'alert-success' : 'alert-error'} font-bold shadow-lg`}>
												<div>{report.replied ? <p className="text-xl 2k:text-2xl">Replied</p> : <p className="text-xl 2k:text-2xl">Not Replied</p>}</div>
											</div>
										</div>

										{/* date/type */}
										<div className="flex flex-row gap-5 2k:gap-10">
											<p className="text-xl 2k:text-2xl">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(report.date.seconds * 1000)}</p>
											<div className={`badge ${report.type === 'contact' && 'badge-primary'} ${report.type === 'comment' && 'badge-secondary'} ${report.type === 'build' && 'badge-accent'} p-4 2k:p-6 text-xl 2k:text-3xl`}>
												{report.type}
											</div>
										</div>

										{/* Submitter Username */}
										<p className="text-xl 2k:text-2xl text-slate-100">
											<span className="italic text-slate-400"> Username: </span> {report.username}
										</p>

										{/* Submitter name */}
										{report.name && (
											<p className="text-xl 2k:text-2xl text-slate-100">
												<span className="italic text-slate-400"> Name: </span> {report.name}
											</p>
										)}

										{/* Submitter email */}
										{report.email && (
											<p className="text-xl 2k:text-2xl text-slate-100">
												<span className="italic text-slate-400"> Email: </span> {report.email}
											</p>
										)}

										{/* Submitters messge */}
										<p className="text-xl 2k:text-2xl text-slate-200">
											<span className="italic text-slate-400"> Message: </span>
											{report.message}
										</p>

										{report.reportedUsername && (
											<p className="text-xl 2k:text-2xl text-slate-200">
												<span className="italic text-slate-400"> Reported username: </span>
												{report.reportedUsername}
											</p>
										)}

										{report.reportedComment && (
											<p className="text-xl 2k:text-2xl text-slate-200">
												<span className="italic text-slate-400"> Reported Comment: </span>
												{report.reportedComment}
											</p>
										)}

										<div className="flex flex-row gap-2">
											<Button text="Delete" size="w-fit" icon="delete" onClick={() => deleteReport(report.id, i)} />
											{report.uid && <Button text="Reply" size="w-fit" icon="upload" onClick={() => setReplying({ uid: report.uid, i, id: report.id })} />}
											{report.buildId && <Button type="ahref" href={`/build/${report.buildId}`} text="Go to build" size="w-fit" icon="right2" />}
										</div>

										{replying.i === i && <TextEditor setState={setReplyMessage} />}
										{replying.i === i && (
											<div className="flex flex-row gap-2">
												<Button text="Send" size="w-fit" icon="save" color="btn-primary" onClick={() => replyToReport()} />
												<Button text="Cancel" size="w-fit" icon="cancel" onClick={handleClearReply} />
											</div>
										)}
									</div>
								);
							})}
						</>
					)}
				</div>
			</MiddleContainer>
		</>
	);
}

export default AdminPanel;
