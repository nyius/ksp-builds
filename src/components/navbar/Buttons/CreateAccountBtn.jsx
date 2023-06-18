import React from 'react';
import Button from '../../buttons/Button';

/**
 * Displays the create account button
 * @returns
 */
function CreateAccountBtn() {
	return <Button type="ahref" href="/sign-up" icon="plus" text="Create Account" css="hidden md:flex" />;
}

export default CreateAccountBtn;
