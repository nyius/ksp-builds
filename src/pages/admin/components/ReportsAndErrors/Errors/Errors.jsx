import React, { useState, useEffect } from 'react';
import { collection, orderBy, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../../firebase.config';
import Button from '../../../../../components/buttons/Button';
import Spinner2 from '../../../../../components/spinners/Spinner2';
import { createDateFromFirebaseTimestamp } from '../../../../../utilities/createDateFromFirebaseTimestamp';

function Errors({ reportTab }) {
	const [errorKeys, setErrorKeys] = useState({});
	const [errorFilters, setErrorFilters] = useState({ function: 'all' });
	const [errors, setErrors] = useState([]);
	const [errorsLoading, setErrorsLoading] = useState(true);
	const [filteredErrors, setFilteredErrors] = useState([]);
	const [selectedErrors, setSelectedErrors] = useState([]);

	useEffect(() => {
		const fetchErrors = async () => {
			try {
				let errorsArr = [];
				let errKeys = {};
				const q = query(collection(db, 'errorReports'), orderBy('date', 'desc'));
				const errorsSnap = await getDocs(q);

				errorsSnap.forEach(error => {
					const errorData = error.data();
					errorData.id = error.id;
					errorsArr.push(errorData);
					errKeys[errorData.func] = errorData.func;
				});

				setErrorKeys(errKeys);
				setErrors(errorsArr);
				setErrorsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};

		fetchErrors();
	}, []);

	useEffect(() => {
		if (errors) {
			setFilteredErrors(prevState => {
				if (errorFilters.function === 'all') {
					return errors;
				} else {
					return errors.filter(error => error.func === errorFilters.function);
				}
			});
		}
	}, [errors, errorFilters]);

	/**
	 * handles selecting multiple errors to delete
	 * @param {*} e
	 */
	const handleSelectingError = e => {
		if (e.target.id === 'selectAllErrors') {
			let ids = [];
			filteredErrors.map(error => {
				ids.push(error.id);
			});

			ids.map(id => {
				const errorEl = document.getElementById(id);
				errorEl.checked = true;
			});

			setSelectedErrors(ids);
		} else if (e.target.id === 'deselectAllErrors') {
			const errorCheckBoxes = document.getElementsByClassName('errorCheckbox');

			for (let i = 0; i < errorCheckBoxes.length; i++) {
				errorCheckBoxes[i].checked = false;
			}

			setSelectedErrors([]);
		} else if (selectedErrors.includes(e.target.id)) {
			setSelectedErrors(prevState => {
				const tempArr = [...prevState];
				const index = tempArr.indexOf(e.target.id);
				tempArr.splice(index, 1);
				return tempArr;
			});
		} else {
			setSelectedErrors(prevState => {
				return [...prevState, e.target.id];
			});
		}
	};

	/**
	 * Handles setting the filter for the errors
	 * @param {*} e
	 */
	const handleSetErrorFilters = e => {
		setErrorFilters(prevState => {
			return {
				...prevState,
				[e.target.id]: e.target.value,
			};
		});

		const errorCheckBoxes = document.getElementsByClassName('errorCheckbox');

		for (let i = 0; i < errorCheckBoxes.length; i++) {
			errorCheckBoxes[i].checked = false;
		}

		setSelectedErrors([]);
	};

	/**
	 * Handles deleting the error report
	 * @param {*} id
	 */
	const deleteError = async error => {
		try {
			await deleteDoc(doc(db, 'errorReports', error));
			setErrors(prevState => {
				const newState = [...prevState];
				const index = prevState.findIndex(tempError => tempError.id === error);

				if (index !== -1) {
					newState.splice(index, 1);
				}
				return newState;
			});
			setSelectedErrors([]);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles deleting multiple errors
	 */
	const deleteMultipleErrors = async () => {
		try {
			selectedErrors.map(error => {
				deleteError(error);
			});

			const errorCheckBoxes = document.getElementsByClassName('errorCheckbox');

			for (let i = 0; i < errorCheckBoxes.length; i++) {
				errorCheckBoxes[i].checked = false;
			}

			setSelectedErrors([]);
		} catch (error) {
			console.log(error);
		}
	};

	if (reportTab !== 1) return;
	if (errorsLoading) return <Spinner2 />;

	return (
		<div className="flex flex-col gap-4 2k:gap-8">
			<div className="flex flex-row gap-4 2k:gap-8">
				{reportTab === 1 ? (
					<div className="flex flex-row gap-4 items-center">
						<div className="text-3xl font-bold text-slate-200"></div>
						{errorFilters.function !== 'all' ? (
							<div className="text-3xl font-bold text-slate-200">
								{filteredErrors.length} {errorFilters.function} Errors
							</div>
						) : (
							''
						)}
						<select name="errorFunctionFilter" id="function" className="select h-16 w-fit text-3xl" onChange={handleSetErrorFilters}>
							<option value="all">All</option>
							{Object.keys(errorKeys).map((functionName, i) => {
								return (
									<option key={functionName} value={functionName}>
										{functionName}
									</option>
								);
							})}
						</select>
						<Button id="selectAllErrors" text="Select All" icon="checked" color="btn-primary" onClick={handleSelectingError} />
						{selectedErrors.length > 0 ? <Button id="deselectAllErrors" text="Deselect" icon="unchecked" onClick={handleSelectingError} /> : null}
						{selectedErrors.length > 0 ? <Button text="Delete Selected" color="btn-error" icon="delete" onClick={deleteMultipleErrors} /> : null}
					</div>
				) : (
					''
				)}
			</div>

			{/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
			{errors.length === 0 && <p className="text-2xl 2k:text-4xl font-bold mb-10 2k:mb-20">No Errors</p>}
			{filteredErrors.map((error, i) => {
				return (
					<div key={i} className="flex flex-col w-full h-fit p-5 2k:p-10 bg-base-200 gap-10 rounded-xl relative">
						{/* date/type */}
						<div className="flex flex-row gap-5 2k:gap-10">
							<p className="text-2xl 2k:text-3xl">{createDateFromFirebaseTimestamp(error.date.seconds, 'long')}</p>
						</div>

						{/* error uid */}
						{error.uid && (
							<p className="text-2xl 2k:text-3xl text-slate-100">
								<span className="italic text-slate-400"> Error UID: </span> {error.uid}
							</p>
						)}

						{/* error url */}
						<p className="text-2xl 2k:text-3xl text-slate-200">
							<span className="italic text-slate-400"> Error URL: </span>
							{error.url}
						</p>

						{/* error function */}
						{error.func && (
							<p className="text-2xl 2k:text-3xl text-slate-100">
								<span className="italic text-slate-400"> Error Function: </span> {error.func}
							</p>
						)}

						{/* error message */}
						<p className="text-2xl 2k:text-3xl text-slate-200">
							<span className="italic text-slate-400"> Error Message: </span>
							{error.error}
						</p>

						<div className="flex flex-row gap-10 items-center">
							<input type="checkbox" id={error.id} className="checkbox errorCheckbox checkbox-primary checkbox-lg border-white" onChange={handleSelectingError} />
							<Button text="Delete" size="w-fit" icon="delete" onClick={() => deleteError(error.id)} />
						</div>
					</div>
				);
			})}
		</div>
	);
}

export default Errors;
