import React, { useEffect, useState, useContext } from 'react';
import { doc, deleteDoc, getDocs, query, collection, orderBy, updateDoc, getDoc, setDoc, getCountFromServer, serverTimestamp, addDoc, getDocFromCache, getDocsFromCache } from 'firebase/firestore';
import { updateMetadata, ref, listAll } from 'firebase/storage';
import { db } from '../../firebase.config';
import { cloneDeep } from 'lodash';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { storage } from '../../firebase.config';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import useAuth from '../../context/auth/AuthActions';
//---------------------------------------------------------------------------------------------------//
import standardNotifications from '../../utilities/standardNotifications';
import { uploadImages } from '../../utilities/uploadImage';
//---------------------------------------------------------------------------------------------------//
import TextInput from '../../components/input/TextInput';
import Button from '../../components/buttons/Button';
import Spinner1 from '../../components/spinners/Spinner1';
import TextEditor from '../../components/textEditor/TextEditor';
import PlanetHeader from '../../components/header/PlanetHeader';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import UsernameLink from '../../components/buttons/UsernameLink';

function AdminPanel() {
	const { user } = useContext(AuthContext);
	const { sendNotification } = useAuth();
	//---------------------------------------------------------------------------------------------------//
	const [uploadingChallengeImage, setUploadingChallengeImage] = useState(false);
	const [reportRepliedFilter, setReportRepliedFilter] = useState(false);
	const [messagesLoading, setMessagesLoading] = useState(true);
	const [replying, setReplying] = useState({ uid: '', i: '' });
	const [siteNotification, setSiteNotification] = useState('');
	const [challengeContent, setChallengeContent] = useState('');
	const [patchNotes, setPatchNotes] = useState('');
	const [patchNotesNotif, setPatchNotesNotif] = useState('');
	const [challenge, setChallenge] = useState({
		image: '',
		title: '',
		date: serverTimestamp(),
		articleId: '',
		type: 'challenge',
		url: '',
		article: '',
	});
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
	const sendSiteMessage = async (content, type) => {
		try {
			if (!content && siteNotification === '') {
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
			newNotif.message = content ? content : siteNotification;
			newNotif.type = type;
			delete newNotif.buildId;
			delete newNotif.buildName;
			delete newNotif.comment;
			delete newNotif.commentId;

			usersSnap.forEach(user => {
				sendNotification(user.id, newNotif);
			});

			// sendNotification('ZyVrojY9BZU5ixp09LftOd240LH3', newNotif);
			toast.success('Message sent!');
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Some function to update all users
	 */
	const updateAllUsers = async () => {
		try {
			const usersRef = collection(db, 'users');
			const usersSnap = await getDocs(usersRef);

			usersSnap.forEach(user => {
				const data = user.data();
				updateDoc(doc(db, 'users', user.id), { rocketReputation: 0 });
				updateDoc(doc(db, 'userProfiles', user.id), { rocketReputation: 0 });
			});

			toast.success('All users updated!');
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles updating every build
	 */
	const updateAllBuilds = async () => {
		try {
			const buildsRef = collection(db, 'builds');
			const buildsSnap = await getDocs(buildsRef);

			buildsSnap.forEach(buildDoc => {
				const buildRef = doc(db, 'builds', buildDoc.id);
				const build = buildDoc.data();

				const regExSpace = new RegExp(' ', 'g');
				const regExHash = new RegExp('#', 'g');
				const regExSlash = new RegExp('/', 'g');
				const urlName = build.name.replace(regExSpace, '-').replace(regExHash, '%23').replace(regExSlash, '%2F');

				const updateBuild = async () => {
					try {
						await updateDoc(buildRef, { urlName });
					} catch (error) {
						console.log(error);
					}
				};

				updateBuild();
			});

			toast.success('All Builds updated!');
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles uploading patch note
	 */
	const uploadPatchNote = async () => {
		try {
			if (patchNotesNotif === '') {
				console.log(`Forgot patch notif`);
				toast.error(`Forgot patch notif`);
				return;
			}
			await setDoc(doc(db, 'patchNotes', uuidv4().slice(0, 15)), { patchNote: patchNotes, timestamp: serverTimestamp() });
			await sendSiteMessage(patchNotesNotif, 'update');

			toast.success('Patch note update!');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong creating patch note');
		}
	};

	/**
	 * Handles uploading a challenge
	 */
	const uploadChallenge = async () => {
		try {
			if (!challenge.title) {
				console.log(`no title`);
				toast.error('Forgot challenge title');
				return;
			}
			if (!challenge.image) {
				console.log(`no image`);
				toast.error('Forgot challenge image');
				return;
			}
			challenge.article = challengeContent;
			challenge.articleId = challenge.title.replace(/ /g, '-');

			await setDoc(doc(db, 'challenges', challenge.articleId), challenge);

			toast.success('Challenge created!');
		} catch (error) {
			toast.error('Something went wrong creating challenge');
			console.log(error);
		}
	};

	/**
	 * Handles uploading an image for a new challenge
	 * @param {*} e
	 */
	const handleUploadChallengeImage = async e => {
		try {
			const newChallengeImage = await uploadImages(e.target.files, setUploadingChallengeImage);

			setChallenge(prevState => {
				return {
					...prevState,
					image: newChallengeImage[0],
				};
			});
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * handles verifying my account to make tweets
	 */
	const verifyTwitter = async () => {
		try {
			axios
				.post('https://us-central1-kspbuilds.cloudfunctions.net/startTwitterVerify', {})
				.then(res => {
					console.log(res);
				})
				.catch(err => console.error(err));
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * handles tweeting
	 */
	const tweet = async () => {
		try {
			axios
				.post('https://us-central1-kspbuilds.cloudfunctions.net/postTweet', { tweet: 'hello from my app!' }, {})
				.then(res => {
					console.log(res);
				})
				.catch(err => console.error(err));
		} catch (error) {
			console.log(error);
		}
	};

	const updateUser = async () => {
		try {
			await updateDoc(doc(db, 'users', 'ZyVrojY9BZU5ixp09LftOd240LH3'), { lastModified: user.dateCreated });
			await updateDoc(doc(db, 'userProfiles', 'ZyVrojY9BZU5ixp09LftOd240LH3'), { lastModified: user.dateCreated });
			toast.success('User updated');
		} catch (error) {
			console.log(error);
		}
	};

	const updateAllStorageItems = async () => {
		try {
			const imagesRef = ref(storage, 'images');

			const newMetadata = {
				cacheControl: 'public,max-age=31536000',
			};

			listAll(imagesRef)
				.then(res => {
					res.items.forEach(image => {
						const imageRef = ref(storage, image._location.path);

						updateMetadata(imageRef, newMetadata)
							.then(metadata => {
								// Updated metadata for 'images/forest.jpg' is returned in the Promise
								console.log(metadata);
							})
							.catch(error => {
								throw new Error(error);
							});
					});
				})
				.catch(err => {
					throw new Error(err);
				});

			toast.success('Storage items updated');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong');
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

				{/* ------------------Stats------------------ */}
				<div className="w-full rounded-xl text-white bg-base-900 flex flex-row p-4 2k:p-8">
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

				<div className="divider my-10"></div>

				{/* ------------------Versions------------------ */}
				{infoLoading ? (
					<Spinner1 />
				) : (
					<div className="flex flex-row flex-wrap bg-base-600 gap-4 rounded-xl p-4 2k:p-8 ">
						<div className="flex flex-col gap-4">
							<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Add a new KSP version</p>
							<TextInput onChange={e => setNewVersion(e.target.value)} placeholder="Version" size="w-44" />
							<Button text="submit" icon="upload" onClick={submitNewVersion} size="w-fit" color="btn-primary" />
						</div>

						<div className="divider divider-horizontal"></div>

						<div className="flex flex-col gap-4 place-content-between">
							<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Upate all Users</p>
							<Button color="btn-primary" text="Update" onClick={updateAllUsers} />
						</div>

						<div className="divider divider-horizontal"></div>

						<div className="flex flex-col gap-4 place-content-between">
							<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Upate all Builds</p>
							<Button color="btn-primary" text="Update" onClick={updateAllBuilds} />
						</div>

						<div className="divider divider-horizontal"></div>

						<div className="flex flex-col gap-4 place-content-between">
							<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Update all storage items</p>
							<Button color="btn-primary" text="Update" onClick={updateAllStorageItems} />
						</div>

						<div className="divider divider-horizontal"></div>

						<div className="flex flex-col gap-4 place-content-between">
							<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Update User</p>
							<Button color="btn-primary" text="Update" onClick={updateUser} />
						</div>

						<div className="divider divider-horizontal"></div>

						{/* <div className="flex flex-col gap-4 place-content-between">
							<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Verify Twitter</p>
							<Button color="btn-primary" text="Verify Twitter" onClick={verifyTwitter} />
						</div>

						<div className="divider divider-horizontal"></div>

						<div className="flex flex-col gap-4 place-content-between">
							<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Tweet</p>
							<Button color="btn-primary" text="Tweet" onClick={tweet} />
						</div> */}
					</div>
				)}

				<div className="divider my-10"></div>

				{/* ------------------ Site Notification ---------------------- */}
				<div className="bg-base-500 rounded-xl p-4 2k:p-8 flex flex-col gap-4">
					<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Send Site-wide message</p>
					<TextEditor setState={setSiteNotification} />
					<Button text="send" color="btn-primary" icon="upload" size="w-fit" onClick={() => sendSiteMessage('', 'message')} />
				</div>

				<div className="divider my-10"></div>

				{/* ------------------ Challenge ---------------------- */}
				<div className="bg-base-500 rounded-xl p-4 2k:p-8 flex flex-col gap-4">
					<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Create New Challenge</p>

					<div className="input-group text-3xl mb-10">
						<span>Title</span>
						<input
							type="text"
							className="input w-full text-3xl text-white"
							placeholder="Challenge Title"
							onChange={e =>
								setChallenge(prevState => {
									return { ...prevState, title: e.target.value };
								})
							}
						/>
					</div>

					{/* image */}
					<div className="flex flex-row gap-4 items-center mb-10">
						<label className="flex flex-row w-fit text-3xl">
							<span className="font-bold p-4">Image</span>
							<input type="file" id="build-image" max="1" accept=".jpg,.png,.jpeg" className="file-input w-full max-w-xs mb-6 2k:file-input-lg text-slate-200" onChange={handleUploadChallengeImage} />
						</label>
						{uploadingChallengeImage && <Spinner1 />}
						{challenge.image && <img src={challenge.image} alt="" className="w-56" />}
					</div>

					{/* Content */}
					<TextEditor setState={setChallengeContent} />
					<Button text="Create" color="btn-primary" icon="upload" size="w-fit" onClick={uploadChallenge} />
				</div>

				<div className="divider my-10"></div>

				{/* ------------------ Patch Notes ---------------------- */}
				<div className="bg-base-500 rounded-xl p-4 2k:p-8 flex flex-col gap-4">
					<p className="text-2xl 2k:text-4xl text-slate-200 font-bold">Create Patch Notes</p>
					<p className="text-2xl 2k:text-4xl text-slate-200">Notif</p>
					<TextEditor setState={setPatchNotesNotif} />
					<p className="text-2xl 2k:text-4xl text-slate-200">Patch Note</p>
					<TextEditor setState={setPatchNotes} />
					<Button text="create" color="btn-primary" icon="upload" size="w-fit" onClick={uploadPatchNote} />
				</div>

				<div className="divider my-10"></div>

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
											<p className="text-xl 2k:text-2xl">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(report.date.seconds * 1000)}</p>
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
				</div>
			</MiddleContainer>
		</>
	);
}

export default AdminPanel;
