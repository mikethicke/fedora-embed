/**
 * A single repository object.
 */

/**
 * WordPress dependencies
 */
import {
	useState,
	useEffect,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	chevronDown,
	chevronRight
} from '../icons';

import { getFileIcon } from '../util';

import FedoraRepository from '../class-fedora-repository';

const RepositoryObject = props => {
	const {
		baseURL,
		objectData
	} = props;

	const [ abstractVisible, setAbstractVisible ] = useState( false );
	const [ itemData, setItemData ]               = useState( null );
	const [ HCItemID, setHCItemID ]               = useState( null );

	const toggleAbstract = () => {
		setAbstractVisible( ! abstractVisible );
	}

	/**
	 * Queries the Humanities Commons API for additional item data. Each object
	 * has two entries in CORE, with sequential pids. Searching the API yields
	 * one pid, which does not contain all of the bibliographic data, but does
	 * have the pid of the other entry, which does. This queries the API for
	 * the other entry, which contains detailed bibliographic data such as
	 * journal name and DOI.
	 */
	useEffect( () => {
		if ( ! itemData && objectData && objectData.identifier && Array.isArray( objectData.identifier ) ) {
			const itemID = objectData.identifier.find( ( id ) => id !== objectData.pid );
			setHCItemID( itemID );
			const repository = new FedoraRepository( baseURL );
			repository.getItemData( itemID )
				.then( ( result ) => {
					setItemData( result );
				} );
		}
	}, [] );

	/**
	 * Render a placeholder if data has not yet been fetched from API.
	 */
	if ( ! objectData || ! itemData ) {
		return (
			<div className = 'fem-object'>
				{ !! objectData &&
					<div className = 'fem-object-title'>
						{ !! objectData.title && objectData.title }
					</div>
				}
				<div className = 'fem-object-placeholder'>

				</div>
			</div>
		);
	}

	// https://hcommons.org/deposits/download/hc:35200/CONTENT/aaa.pdf/
	const downloadLink = `${baseURL}download/${objectData.pid}/CONTENT/${objectData.label}`;

	// https://hcommons.org/deposits/view/hc:35200/CONTENT/aaa.pdf/
	const viewLink = `${baseURL}view/${objectData.pid}/CONTENT/${objectData.label}`

	const creatorString = Array.isArray( objectData.creator ) ?
		objectData.creator.join() :
		objectData.creator;

	const fileIcon = objectData.format ? getFileIcon( objectData.format ) : null;

	let sourceString = false;
	if ( 
		itemData &&
		itemData.relatedItem &&
		itemData.relatedItem.titleInfo &&
		itemData.relatedItem.titleInfo.title 
	) {
		sourceString = itemData.relatedItem.titleInfo.title
	} else if ( objectData && objectData.publisher ) {
		sourceString = objectData.publisher;
	}

	let doiString = false;
	if (
		itemData &&
		itemData.relatedItem &&
		itemData.relatedItem.identifier &&
		Array.isArray( itemData.relatedItem.identifier ) &&
		itemData.relatedItem.identifier[0]
	) {
		doiString = itemData.relatedItem.identifier[0];
	}

	return (
		<div className = 'fem-object'>
			<div className = 'fem-object-title'>
				{ !! objectData.title && objectData.title }
			</div>
			<div className = 'fem-object-creator'>
				{ creatorString }
				{ ! sourceString && !! objectData.date &&
					<span> ({ objectData.date })</span>
				}
			</div>
			{ !! sourceString && 
				<div className = 'fem-object-publisher'>
					<span>{ sourceString }</span>
					{ !! objectData.date &&
						<span> ({ objectData.date })</span>
					}
				</div>
			}
			{ doiString &&
				<div className = 'fem-object-doi'>
					<a href = { `http://dx.doi.org/${doiString}` }>{ doiString }</a>
				</div>
			}
			{ !! objectData.description &&
				<div className = 'fem-object-description-wrapper'>
					<a onClick = { toggleAbstract }>
						{ abstractVisible && chevronDown }
						{ ! abstractVisible && chevronRight }
						Abstract
					</a>
					<div className = { 'fem-object-description' + ( abstractVisible ? ' open' : ' closed' ) }>
						{ objectData.description }
					</div>
				</div>
			}
			{ !! HCItemID &&
				<div className = 'fem-object-hc-link'>
					<a href = { `https://hcommons.org/deposits/item/${HCItemID}`}>
						View full record on <span className='fem-object-hc-link-hcc'>Humanities Commons CORE</span>
					</a>
				</div>
			}
			<div className = 'fem-object-file-links'>
				{ !! fileIcon && fileIcon }
				<a href={ downloadLink }>Download</a>
				<a href={ viewLink }>View</a>
			</div>
		</div>
	);
}

export default RepositoryObject;