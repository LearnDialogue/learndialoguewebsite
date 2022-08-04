<?php

/*
	cmmitch2 2013.12.16: Modified from IEEEStyleForBibtexbrowser:
		https://github.com/KaiBi/IEEEStyleForBibtexbrowser
*/

function LearnDialogueStyle(&$bibentry) {
	
	/*
	   IEEEStyleForBibtexbrowser uses $entryType for the bibtex entry type and $type for
	   the field within an entry.
	*/
	$entryType = strtolower($bibentry->getField(Q_INNER_TYPE));
	$type = false;
	if ($bibentry->hasField(Q_TYPE))
		$type = $bibentry->getField(Q_INNER_TYPE);
	
	$author = false;
	if ($bibentry->hasField(Q_AUTHOR)) {
	
		// abbreviate author names
		$authors = $bibentry->getFormattedAuthors();
		for ($i = 0; $i < count($authors); $i++) {
			// do not forget the author links if available
			if (BIBTEXBROWSER_AUTHOR_LINKS=='homepage') {
				$authors[$i] = $bibentry->addHomepageLink($authors[$i]);
			}
			if (BIBTEXBROWSER_AUTHOR_LINKS=='resultpage') {
				$authors[$i] = $bibentry->addAuthorPageLink($authors[$i]);
			}
		}

		$author = implode(', ', $authors);
	}

	$title = false;
	if ($bibentry->hasField(TITLE)) {
		$title = $bibentry->getTitle();
		$title = '<span class="bibtitle">' . $title . '</span>';
	}
	if ($title && $bibentry->hasField('url'))
		$title = '<a class="bibtitlelink"' . (BIBTEXBROWSER_BIB_IN_NEW_WINDOW? ' target="_blank" ' : '') . ' href="' . $bibentry->getField("url") . '">' . $title . '</a>';
	
	$publisher = false;
	if ($bibentry->hasField('publisher'))
		// we do not want the 'special' logic from the 'getPublisher'-method
		$publisher = $bibentry->getField('publisher');

	$address = false;
	if ($bibentry->hasField('address'))
		$address = $bibentry->getField('address');

	$venue = false;
	if ($bibentry->hasField('venue'))
		$venue = $bibentry->getField('venue');

	$editor = false;
	if ($bibentry->hasField(EDITOR)) {
		$editors = $bibentry->getEditors();
		for ($i = 0; $i < count($editors); $i++) {
			$a = $editors[$i];
			// check author format; "Firstname Lastname" or "Lastname, Firstname"
			if (strpos($a, ',') === false) {
				$parts = explode(' ', $a);
				$lastname = trim(array_pop($parts));
				$firstnames = $parts;
			} else {
				$parts = explode(',', $a);
				$lastname = trim($parts[0]);
				$firstnames = explode(' ', trim($parts[1]));
			}
			$name = array();
			foreach ($firstnames as $fn)
				$name[] = substr(trim($fn), 0, 1) . '.';
			// do not forget the author links if available
			if (BIBTEXBROWSER_AUTHOR_LINKS=='homepage') {
				$editors[$i] = $bibentry->addHomepageLink(implode(' ', $name) . ' ' . $lastname);
			}
			if (BIBTEXBROWSER_AUTHOR_LINKS=='resultpage') {
				$editors[$i] = $bibentry->addAuthorPageLink(implode(' ', $name) . ' ' . $lastname);
			}
		}
		
		if (count($editors) > 3)
			$editor = $editors[0] . ' et al. (Eds.)';
		else if (count($editors) > 1)
			$editor = implode(', ', $editors) . ' (Eds.)';
		else
			$editor = $editors[0] . ' (Ed.)';
	}
	
	$booktitle = false;
	if ($bibentry->hasField(BOOKTITLE))
		$booktitle = $bibentry->getField(BOOKTITLE);
	
	$school = false;
	if ($bibentry->hasField(SCHOOL))
		$school = $bibentry->getField(SCHOOL);
	
	$year = false;
	if ($bibentry->hasField(YEAR))
		$year = $bibentry->getField(YEAR);
	
	$edition = false;
	$editionShort = false;
	if ($bibentry->hasField('edition')) {
		$edition = $bibentry->getField('edition');
		// extend this if you need hihgher edition numbers
		$editionToShort = array (
			'first' => '1st',
			'second' => '2nd',
			'third' => '3rd',
			'fourth' => '4th',
			'fifth' => '5th'
		);
		// convert textual edition ordinals to numeric
		if (array_key_exists(strtolower($edition), $editionToShort))
			$editionShort = $editionToShort[strtolower($edition)];
	}
	
	$comment = false;
	if ($bibentry->hasField('comment'))
		$comment = $bibentry->getField('comment');
	
	$pages = false;
	if ($bibentry->hasField('pages'))
		$pages = 'pp. ' . str_replace('--', '-', $bibentry->getField('pages'));
	
	$journal = false;
	if ($bibentry->hasField('journal'))
		$journal = $bibentry->getField('journal');
	
	$volume = false;
	if ($bibentry->hasField('volume'))
		$volume = $bibentry->getField('volume');
	
	$number = false;
	if ($bibentry->hasField('number'))
		$number = $bibentry->getField('number');
	
	$month = false;
	if ($bibentry->hasField('month'))
		$month = $bibentry->getField('month');
	
	$chapter = false;
	if ($bibentry->hasField('chapter'))
		$chapter = 'ch. ' . $bibentry->getField('chapter');
	
	$institution = false;
	if ($bibentry->hasField('institution'))
		$institution = $bibentry->getField('institution');
	
	$entry = array();
	$result = '';
	
	// redundancies are left on purpose to improve changeability
	switch ($entryType) {
		case 'article':
			if ($title) $entry[] = $title . '. ';
			if ($author) $entry[] = $author . '. ';
			if ($journal) $entry[] = '<i>' . $journal . '</i>';
			if ($volume) $entry[] = ', vol. ' . $volume;
			if ($number && $volume) $entry[] = ' no. ' . $number;
			if ($year) $entry[] = ', ' . $year;
			if ($pages) $entry[] = ', ' . $pages;
			break;
		case 'book':
			if ($title) $entry[] = $title . '. ';
			if ($author) $entry[] = $author . '. ';
				else if ($editor) $entry[] = $editor . '. ';
			if ($publisher && $year) $entry[] = $publisher . ', ' . $year;
				else if ($publisher) $entry[] = $publisher;
				else if ($year) $entry[] = $year;
			break;			
		case 'booklet':
			break;
		case 'conference':
			break;
		case 'inbook':
			if ($title) $entry[] = $title . '. ';
			if ($author) $entry[] = $author . '. ';
			if ($booktitle) $entry[] = '<i>' . $booktitle . '</i>';
			if ($editor) $entry[] = ', ' . $editor;
			if ($publisher) $entry[] = ', ' .$publisher;
			if ($year) $entry[] = ', ' . $year;
			if ($chapter) $entry[] = ', ch. ' . $chapter;
			if ($pages) $entry[] = ', ' . $pages;
			break;
		case 'incollection':
			if ($title) $entry[] = $title . '. ';
			if ($author) $entry[] = $author . '. ';
			if ($booktitle) $entry[] = '<i>' . $booktitle . '</i>';
			if ($editor) $entry[] = ', ' . $editor;
			if ($publisher) $entry[] = ', ' .$publisher;
			if ($year) $entry[] = ', ' . $year;
			if ($chapter) $entry[] = ', ch. ' . $chapter;
			if ($pages) $entry[] = ', ' . $pages;
			break;
		case 'inproceedings':
		case 'misc':
			if ($title) $entry[] = $title . '. ';
			if ($author) $entry[] = $author . '. ';
			if ($booktitle) $entry[] = '<i>' . $booktitle . '</i>';
			if ($venue) $entry[] = ', ' . $venue;
			if ($year) $entry[] = ', ' . $year;
			if ($pages) $entry[] = ', ' . $pages;
			break;
		case 'manual':
			break;
		case 'mastersthesis':
			break;
		case 'phdthesis':
			break;
		default:
			break;
	}
	
	$result = implode('', $entry);
	if ($comment) $result .= ' (' . $comment .')';
		$result .= '.';
	return $result . "\n" . $bibentry->toCoins();
}

?>
