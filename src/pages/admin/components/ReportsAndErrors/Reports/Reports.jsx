import React, { useState, useEffect } from 'react';
import { deleteDoc, updateDoc, doc, collection, orderBy, getDocs, query } from 'firebase/firestore';
import Button from '../../../../../components/buttons/Button';
import Spinner2 from '../../../../../components/spinners/Spinner2';
import { createDateFromFirebaseTimestamp } from '../../../../../utilities/createDateFromFirebaseTimestamp';
import { cloneDeep } from 'lodash';
import { db } from '../../../../../firebase.config';
import { toast } from 'react-toastify';
import UsernameLink from '../../../../../components/username/UsernameLink';
import { useAuthContext } from '../../../../../context/auth/AuthContext';
import standardNotifications from '../../../../../utilities/standardNotifications';
import { sendNotification } from '../../../../../context/auth/AuthUtils';
import TextEditor from '../../../../../components/textEditor/TextEditor';

function Reports({ reportTab }) {
	const { user } = useAuthContext();
	const [messagesLoading, setMessagesLoading] = useState(true);
	const [sortedReports, setSortedReports] = useState([]);
	const [reports, setReports] = useState([]);
	const [reportRepliedFilter, setReportRepliedFilter] = useState(false);
	const [replying, setReplying] = useState({ uid: '', i: '' });
	const [replyMessage, setReplyMessage] = useState('');

	useEffect(() => {
		const fetchReportsAndMessages = async () => {
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

		fetchReportsAndMessages();
	}, []);

	useEffect(() => {
		setSortedReports(prevState => {
			return reports.filter(report => {
				if (!reportRepliedFilter) return report;
				if (reportRepliedFilter && !report.replied) return report;
			});
		});
	}, [reports, reportRepliedFilter]);

	/**
	 * handles clearing a reply
	 */
	const handleClearReply = () => {
		setReplying({ uid: '', i: '' });
		setReplyMessage('');
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

	return (
		<>
			{reportTab === 0 ? (
				<>
					{messagesLoading ? (
						<Spinner2 />
					) : (
						<>
							{reports.length === 0 && <p className="text-2xl 2k:text-4xl font-bold mb-10 2k:mb-20">No Messages</p>}
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
											<p className="text-xl 2k:text-2xl">{createDateFromFirebaseTimestamp(report.date.seconds, 'long')}</p>
											<div
												className={`badge ${report.type === 'contact' && 'badge-primary'} ${report.type === 'comment' && 'badge-secondary'} ${report.type === 'build' && 'badge-accent'} ${
													report.type === 'user' && 'badge-info'
												}  p-4 2k:p-6 text-xl 2k:text-3xl`}
											>
												{report.type}
											</div>
										</div>

										{/* Submitter Username */}
										<div className="text-xl 2k:text-2xl text-slate-100">
											<span className="italic text-slate-400">Submitter Username: </span> {report.uid ? <UsernameLink username={report.username} uid={report.uid} /> : 'Anon'}
										</div>

										{/* Submitter name */}
										{report.name && (
											<p className="text-xl 2k:text-2xl text-slate-100">
												<span className="italic text-slate-400"> Submitter Name: </span> {report.name}
											</p>
										)}

										{/* Submitter email */}
										{report.email && (
											<p className="text-xl 2k:text-2xl text-slate-100">
												<span className="italic text-slate-400"> Submitter Email: </span> {report.email}
											</p>
										)}

										{/* Submitters messge */}
										<p className="text-xl 2k:text-2xl text-slate-200">
											<span className="italic text-slate-400"> Submitter Message: </span>
											{report.message}
										</p>

										{report.reportedUsername && (
											<div className="text-xl 2k:text-2xl text-slate-200">
												<span className="italic text-slate-400"> Reported username: </span>
												{report.reportedUid ? <UsernameLink username={report.reportedUsername} uid={report.reportedUid} /> : 'Anon'}
											</div>
										)}

										{report.reportedComment && (
											<p className="text-xl 2k:text-2xl text-slate-200">
												<span className="italic text-slate-400"> Reported Comment: </span>
												{report.reportedComment}
											</p>
										)}

										{report.reportedBuild && (
											<p className="text-xl 2k:text-2xl text-slate-200">
												<span className="italic text-slate-400"> Reported Build: </span>
												{report.reportedBuild}
											</p>
										)}

										<div className="flex flex-row gap-2">
											<Button text="Delete" size="w-fit" icon="delete" onClick={() => deleteReport(report.id, i)} />
											{report.uid && <Button text="Reply" size="w-fit" icon="upload" onClick={() => setReplying({ uid: report.uid, i, id: report.id })} />}
											{report.buildId && <Button type="ahref" target="blank" href={`/build/${report.buildId}`} text="Go to build" size="w-fit" icon="right2" />}
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
				</>
			) : null}
		</>
	);
}

export default Reports;
