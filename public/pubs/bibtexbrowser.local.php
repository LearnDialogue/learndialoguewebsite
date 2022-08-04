<?php
define('BIBLIOGRAPHYSECTIONS','LearnDialogueSections');

/** is the default sectioning for AcademicDisplay (books, articles, proceedings, etc. ) */
function LearnDialogueSections() {
return  
  array(
  // Books
    array(
      'query' => array(Q_TYPE=>'book|proceedings'),
      'title' => 'books'
    ),
  // Book chapters
    array(
      'query' => array(Q_TYPE=>'incollection|inbook'),
      'title' => 'book chapters'
    ),
  // Journal / Bookchapters
    array(
      'query' => array(Q_TYPE=>'article'),
      'title' => 'journal articles'
    ),
  // conference papers
    array(
      'query' => array(Q_TYPE=>'inproceedings|conference',Q_EXCLUDE=>'workshop'),
      'title' => 'conference papers'
    ),
  // workshop papers
    array(
      'query' => array(Q_TYPE=>'inproceedings',Q_SEARCH=>'workshop'),
      'title' => 'workshop papers'
    ),
  // posters
    array(
      'query' => array(Q_TYPE=>'misc'),
      'title' => 'posters'
    ),
  // thesis and tech reports
    array(
      'query' => array(Q_TYPE=>'phdthesis|mastersthesis|bachelorsthesis|techreport'),
      'title' => 'other publications'
    )
  );
}

?>