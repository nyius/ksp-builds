import React from 'react';
import Button from '../../../../components/buttons/Button';

/**
 * Button to lead to the contact page
 * @returns
 */
function ContactBtn() {
	return <Button type="ahref" href="/contact" color="btn-primary" icon="email" size="w-full" text="Get in touch" />;
}

export default ContactBtn;
