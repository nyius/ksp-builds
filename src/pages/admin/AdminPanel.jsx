import React, { useEffect, useState, useContext } from 'react';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import { db } from '../../firebase.config';
import { doc, deleteDoc, getDocs, query, collection, orderBy } from 'firebase/firestore';
import Button from '../../components/buttons/Button';

function AdminPanel() {
	const [reports, setReports] = useState([]);

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
			} catch (error) {
				console.log(error);
			}
		};

		fetchMessages();
	}, []);

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

	//---------------------------------------------------------------------------------------------------//
	return (
		<MiddleContainer>
			<PlanetHeader text="Admin" />
			<div className="flex flex-col gap-10">
				{reports.length === 0 && <p className="text-2xl 2k:text-4xl font-bold">No Reports</p>}
				{reports.map((report, i) => {
					return (
						<div key={i} className="flex flex-col w-full h-fit p-5 2k:p-10 bg-base-200 gap-10 rounded-xl">
							<p className="text-2xl 2k:text-4xl">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(report.date.seconds * 1000)}</p>
							<p className="text-2xl 2k:text-4xl text-slate-100">
								<span className="italic text-slate-400"> Username: </span> {report.username}
							</p>
							<p className="text-2xl 2k:text-4xl text-slate-100">
								<span className="italic text-slate-400"> Name: </span> {report.name}
							</p>
							<p className="text-2xl 2k:text-4xl text-slate-100">
								<span className="italic text-slate-400"> Email: </span> {report.email}
							</p>
							<p className="text-2xl 2k:text-4xl text-slate-300">{report.comment}</p>
							<Button text="Delete" size="w-fit" icon="delete" onClick={() => deleteReport(report.id, i)} />
						</div>
					);
				})}
			</div>
		</MiddleContainer>
	);
}

export default AdminPanel;
