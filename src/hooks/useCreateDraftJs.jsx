import { useEffect, useState } from 'react';
import { convertFromRaw, EditorState, ContentState } from 'draft-js';
import checkIfJson from '../utilities/checkIfJson';

/**
 * Creates draft JS formatted content.
 * @param {*} initialState - the initial state
 * @param {*} rawDraftJs - the raw draft js to convert to draft JS compatible content
 * @returns [draftJS, setDraftJS]
 */
function useCreateDraftJs(initialState, rawDraftJs) {
	const [draftJS, setDraftJS] = useState(initialState);

	useEffect(() => {
		if (checkIfJson(rawDraftJs)) {
			setDraftJS(EditorState.createWithContent(convertFromRaw(JSON.parse(rawDraftJs))));
		} else {
			setDraftJS(EditorState.createWithContent(ContentState.createFromText(rawDraftJs)));
		}
	}, [rawDraftJs]);

	return [draftJS, setDraftJS];
}

export default useCreateDraftJs;
