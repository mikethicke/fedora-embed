/**
 * WordPress dependencies
 */
import {
	render
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import EmbedBlockFront from './embed-block/front';
import {
	attributesFromJSON
} from './util';

import './style.scss';

/**
 * Render Fedora Embed blocks.
 *
 * Render callback ( @see blocks.php ) outputs <div> elements with
 * 'fem-embed-block-frontend' class and JSON-encoded attributes. Find each of
 * those <div>s in the page and render the frontend view of the block in them.
 */
const embedBlockElements = document.getElementsByClassName('fem-embed-block-frontend');
if ( embedBlockElements ) {
	for ( let i = 0; i < embedBlockElements.length; i++ ) {
		const embedBlockElement = embedBlockElements[i];
		const attributes = attributesFromJSON( embedBlockElement.dataset.attributes );
		render (
			<EmbedBlockFront
				attributes = { attributes }
			/>,
			embedBlockElement
		);
	}
}