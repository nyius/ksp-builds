import React from 'react';
import Button from '../../buttons/Button';

/**
 * Displays a news button
 * @returns
 */
function NewsBtn() {
	return <Button type="ahref" href="/news" css="text-white hidden lg:flex" text="KSP News" icon="news" />;
}

export default NewsBtn;
