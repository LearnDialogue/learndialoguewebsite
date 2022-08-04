/**
 * Blockly Demos: Code
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly's Code demo.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Code = {};

/*
* Event Logging Variables
*/

var EventLogging = {};
var sessionID = '-'; 
var phpFile = "log-data.php";
var localTime = new Date();
var localTimeString = "-";
var blocklyEventType = "-";
var blockName = "-";
var element   = "-";
var blockField= "-"
var newValue  = "-";
var oldValue  = "-";
var currentStudentCode = "-";
var rawJSON = "-";

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
Code.LANGUAGE_NAME = {
  'ar': 'العربية',
  'be-tarask': 'Taraškievica',
  'br': 'Brezhoneg',
  'ca': 'Català',
  'cs': 'Česky',
  'da': 'Dansk',
  'de': 'Deutsch',
  'el': 'Ελληνικά',
  'en': 'English',
  'es': 'Español',
  'et': 'Eesti',
  'fa': 'فارسی',
  'fr': 'Français',
  'he': 'עברית',
  'hrx': 'Hunsrik',
  'hu': 'Magyar',
  'ia': 'Interlingua',
  'is': 'Íslenska',
  'it': 'Italiano',
  'ja': '日本語',
  'ko': '한국어',
  'mk': 'Македонски',
  'ms': 'Bahasa Melayu',
  'nb': 'Norsk Bokmål',
  'nl': 'Nederlands, Vlaams',
  'oc': 'Lenga d\'òc',
  'pl': 'Polski',
  'pms': 'Piemontèis',
  'pt-br': 'Português Brasileiro',
  'ro': 'Română',
  'ru': 'Русский',
  'sc': 'Sardu',
  'sk': 'Slovenčina',
  'sr': 'Српски',
  'sv': 'Svenska',
  'ta': 'தமிழ்',
  'th': 'ภาษาไทย',
  'tlh': 'tlhIngan Hol',
  'tr': 'Türkçe',
  'uk': 'Українська',
  'vi': 'Tiếng Việt',
  'zh-hans': '简体中文',
  'zh-hant': '正體中文'
};

/**
 * List of RTL languages.
 */
Code.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];

/**
 * Blockly's main workspace.
 * @type {Blockly.WorkspaceSvg}
 */
Code.workspace = null;

/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if paramater not found.
 * @return {string} The parameter value or the default value if not found.
 */
Code.getStringParamFromUrl = function(name, defaultValue) {
  var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
Code.getLang = function() {
  var lang = Code.getStringParamFromUrl('lang', '');
  if (Code.LANGUAGE_NAME[lang] === undefined) {
    // Default to English.
    lang = 'en';
  }
  return lang;
};

/**
 * Is the current language (Code.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
Code.isRtl = function() {
  return Code.LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};

/**
 * Load blocks saved on App Engine Storage or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
Code.loadBlocks = function(defaultXml) {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch(e) {
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if ('BlocklyStorage' in window && window.location.hash.length > 1) {
    // An href with #key trigers an AJAX call to retrieve saved blocks.
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else if (loadOnce) {
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if ('BlocklyStorage' in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
};

/**
 * Save the blocks and reload with a different language.
 */
Code.changeLanguage = function() {
  // Store the blocks for the duration of the reload.
  // This should be skipped for the index page, which has no blocks and does
  // not load Blockly.
  // MSIE 11 does not support sessionStorage on file:// URLs.
  if (typeof Blockly != 'undefined' && window.sessionStorage) {
    var xml = Blockly.Xml.workspaceToDom(Code.workspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
  }

  var languageMenu = document.getElementById('languageMenu');
  var newLang = encodeURIComponent(
      languageMenu.options[languageMenu.selectedIndex].value);
  var search = window.location.search;
  if (search.length <= 1) {
    search = '?lang=' + newLang;
  } else if (search.match(/[?&]lang=[^&]*/)) {
    search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
  } else {
    search = search.replace(/\?/, '?lang=' + newLang + '&');
  }

  window.location = window.location.protocol + '//' +
      window.location.host + window.location.pathname + search;
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
Code.bindClick = function(el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('click', func, true);
  el.addEventListener('touchend', func, true);
};

/**
 * Load the Prettify CSS and JavaScript.
 */
Code.importPrettify = function() {
  //<link rel="stylesheet" href="../prettify.css">
  //<script src="../prettify.js"></script>
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', 'prettify.css');
  document.head.appendChild(link);
  var script = document.createElement('script');
  script.setAttribute('src', 'prettify.js');
  document.head.appendChild(script);
};

/**
 * Compute the absolute coordinates and dimensions of an HTML element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
Code.getBBox_ = function(element) {
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  return {
    height: height,
    width: width,
    x: x,
    y: y
  };
};

/**
 * User's language (e.g. "en").
 * @type {string}
 */
Code.LANG = Code.getLang();

/**
 * List of tab names.
 * @private
 */
Code.TABS_ = ['blocks']; //, 'javascript','python','dart', 'lua', 'xml'

Code.selected = 'blocks';

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} clickedName Name of tab clicked.
 */
Code.tabClick = function(clickedName) {
  // If the XML tab was open, save and render the content.
  /*
  if (document.getElementById('tab_xml').className == 'tabon') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlText = xmlTextarea.value;
    var xmlDom = null;
    try {
      xmlDom = Blockly.Xml.textToDom(xmlText);
    } catch (e) {
      var q =
          window.confirm(MSG['badXml'].replace('%1', e));
      if (!q) {
        // Leave the user on the XML tab.
        return;
      }
    }
    if (xmlDom) {
      Code.workspace.clear();
      Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
    }
  }
  */
  if (document.getElementById('tab_blocks').className == 'tabon') {
    Code.workspace.setVisible(false);
  }
  // Deselect all tabs and hide all panes.
  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    document.getElementById('tab_' + name).className = 'taboff';
    document.getElementById('content_' + name).style.visibility = 'hidden';
  }

  // Select the active tab.
  Code.selected = clickedName;
  document.getElementById('tab_' + clickedName).className = 'tabon';
  // Show the selected pane.
  document.getElementById('content_' + clickedName).style.visibility =
      'visible';
  Code.renderContent();
  if (clickedName == 'blocks') {
    Code.workspace.setVisible(true);
  }
  Blockly.svgResize(Code.workspace);
};

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
Code.renderContent = function() {
  var content = document.getElementById('content_' + Code.selected);
  // Initialize the pane.
  if (content.id == 'content_xml') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    xmlTextarea.value = xmlText;
    xmlTextarea.focus();
  } else if (content.id == 'content_javascript') {
    var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
    content.textContent = code;
    if (typeof prettyPrintOne == 'function') {
      code = content.innerHTML;
      code = prettyPrintOne(code, 'js');
      content.innerHTML = code;
    }
  } else if (content.id == 'content_python') {
    code = Blockly.Python.workspaceToCode(Code.workspace);
    content.textContent = code;
    if (typeof prettyPrintOne == 'function') {
      code = content.innerHTML;
      code = prettyPrintOne(code, 'py');
      content.innerHTML = code;
    }
  } else if (content.id == 'content_php') {
    code = Blockly.PHP.workspaceToCode(Code.workspace);
    content.textContent = code;
    if (typeof prettyPrintOne == 'function') {
      code = content.innerHTML;
      code = prettyPrintOne(code, 'php');
      content.innerHTML = code;
    }
  } else if (content.id == 'content_dart') {
    code = Blockly.Dart.workspaceToCode(Code.workspace);
    content.textContent = code;
    if (typeof prettyPrintOne == 'function') {
      code = content.innerHTML;
      code = prettyPrintOne(code, 'dart');
      content.innerHTML = code;
    }
  } else if (content.id == 'content_lua') {
    code = Blockly.Lua.workspaceToCode(Code.workspace);
    content.textContent = code;
    if (typeof prettyPrintOne == 'function') {
      code = content.innerHTML;
      code = prettyPrintOne(code, 'lua');
      content.innerHTML = code;
    } else if (content.id == 'content_xml') {
      code = Blockly.Lua.workspaceToCode(Code.workspace);
      content.textContent = code;
      if (typeof prettyPrintOne == 'function') {
        code = content.innerHTML;
        code = prettyPrintOne(code, 'php');
        content.innerHTML = code;
      }
    }
  }
};

/**
 * Initialize Blockly.  Called on page load.
 */
Code.init = function() {
  Code.initLanguage();

  var rtl = Code.isRtl();
  var container = document.getElementById('content_area');
  var onresize = function(e) {
    var bBox = Code.getBBox_(container);
    for (var i = 0; i < Code.TABS_.length; i++) {
      var el = document.getElementById('content_' + Code.TABS_[i]);
      el.style.top = bBox.y + 'px';
      el.style.left = bBox.x + 'px';
      // Height and width need to be set, read back, then set again to
      // compensate for scrollbars.
      el.style.height = bBox.height + 'px';
      el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
      el.style.width = bBox.width + 'px';
      el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
    }
    // Make the 'Blocks' tab line up with the toolbox.
    /*if (Code.workspace && Code.workspace.toolbox_.width) {
      document.getElementById('tab_blocks').style.minWidth =
          (Code.workspace.toolbox_.width - 38) + 'px';
          // Account for the 19 pixel margin and on each side.
    }*/
  };
  window.addEventListener('resize', onresize, false);

  // Interpolate translated messages into toolbox.
  var toolboxText = document.getElementById('toolbox').outerHTML;
  toolboxText = toolboxText.replace(/{(\w+)}/g,
      function(m, p1) {return MSG[p1]});
  var toolboxXml = Blockly.Xml.textToDom(toolboxText);

  Code.workspace = Blockly.inject('content_blocks',
      {grid:
          {spacing: 25,
           length: 3,
           colour: '#5bcbc8', //Engage Blue -- the dots within the text block
           snap: true},
       media: 'blocklyAssets/dependencies/media/',
       rtl: rtl,
       toolbox: toolboxXml,
       zoom:
           {controls: true,
            wheel: false}
      });

  // Add to reserved word list: Local variables in execution environment (runJS)
  // and the infinite loop detection function.
  Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');

  Code.loadBlocks('');
  Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'),Code.workspace);

  if ('BlocklyStorage' in window) {
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload(Code.workspace);
  }

  Code.tabClick(Code.selected);

  Code.bindClick('trashButton',
      function() {Code.discard(); Code.renderContent();});
  Code.bindClick('runButton', Code.runJS);
  // Disable the link button if page isn't backed by App Engine storage.
  var linkButton = document.getElementById('linkButton');
  if ('BlocklyStorage' in window) {
    BlocklyStorage['HTTPREQUEST_ERROR'] = MSG['httpRequestError'];
    BlocklyStorage['LINK_ALERT'] = MSG['linkAlert'];
    BlocklyStorage['HASH_ERROR'] = MSG['hashError'];
    BlocklyStorage['XML_ERROR'] = MSG['xmlError'];
    Code.bindClick(linkButton,
        function() {BlocklyStorage.link(Code.workspace);});
  } else if (linkButton) {
    linkButton.className = 'disabled';
  }

  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    Code.bindClick('tab_' + name,
        function(name_) {return function() {Code.tabClick(name_);};}(name));
  }
  onresize();

  Code.workspace.addChangeListener(Code.mirrorEvent);

  Code.workspace.clearUndo();
  // When Blockly changes, update the graph.
  //Code.workspace.addChangeListener(Code.drawVisualization);

  Blockly.svgResize(Code.workspace);
  // Lazy-load the syntax-highlighting.
  window.setTimeout(Code.importPrettify, 1);
};

/**
 * Initialize the page language.
 */
Code.initLanguage = function() {
  // Set the HTML's language and direction.
  var rtl = Code.isRtl();
  document.dir = rtl ? 'rtl' : 'ltr';
  document.head.parentElement.setAttribute('lang', Code.LANG);

  // Sort languages alphabetically.
  var languages = [];
  for (var lang in Code.LANGUAGE_NAME) {
    languages.push([Code.LANGUAGE_NAME[lang], lang]);
  }
  var comp = function(a, b) {
    // Sort based on first argument ('English', 'Русский', '简体字', etc).
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  };
  languages.sort(comp);
  // Populate the language selection menu.
  var languageMenu = document.getElementById('languageMenu');
  languageMenu.options.length = 0;
  for (var i = 0; i < languages.length; i++) {
    var tuple = languages[i];
    var lang = tuple[tuple.length - 1];
    var option = new Option(tuple[0], lang);
    if (lang == Code.LANG) {
      option.selected = true;
    }
    languageMenu.options.add(option);
  }
  languageMenu.addEventListener('change', Code.changeLanguage, true);

  // Inject language strings.
  document.title += ' ' + MSG['title'];
  document.getElementById('title').textContent = MSG['title'];
  document.getElementById('tab_blocks').textContent = MSG['blocks'];

  document.getElementById('linkButton').title = MSG['linkTooltip'];
  document.getElementById('runButton').title = MSG['runTooltip'];
  document.getElementById('trashButton').title = MSG['trashTooltip'];
};

/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
 */
Code.runJS = function() {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';
  var timeouts = 0;
  var checkTimeout = function() {
    if (timeouts++ > 1000000) {
      throw MSG['timeout'];
    }
  };
  var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  try {
    eval(code);
    //console.log("Run Button Pressed: ");
    //console.log(code);
    blocklyEventType = "RUN_BUTTON_PRESSED!";
    blockName = "ALL_BLOCKS";
    newValue = "Success!";
    currentStudentCode = Blockly.JavaScript.workspaceToCode(Code.workspace);
    EventLogging.callPHP(sessionID, blocklyEventType, blockName, element, blockField,newValue,oldValue,currentStudentCode,rawJSON);

  } catch (e) {
    //console.log("Run Button Pressed: Alert: 'badCode!' ");
    //console.log(code);
    alert(MSG['badCode'].replace('%1', e));
    blocklyEventType = "RUN_BUTTON_PRESSED!";
    blockName = "ALL_BLOCKS";
    newValue = "badCode!!";
    currentStudentCode = Blockly.JavaScript.workspaceToCode(Code.workspace);
    EventLogging.callPHP(sessionID, blocklyEventType, blockName, element, blockField,newValue,oldValue,currentStudentCode,rawJSON);
  }

};

/**
 * Discard all blocks from the workspace.
 */
Code.discard = function() {
  var count = Code.workspace.getAllBlocks().length;
  currentStudentCode = Blockly.JavaScript.workspaceToCode(Code.workspace);
  if (count < 2 ||
      window.confirm(Blockly.Msg.DELETE_ALL_BLOCKS.replace('%1', count))) {
    Code.workspace.clear();
    EventLogging.callPHP(sessionID, "TRASH_ALL_BLOCKS", "ALL_BLOCKS", element, blockField,newValue,oldValue,currentStudentCode,rawJSON);
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
  //console.log("Discarded ALL code!");
};


Code.mirrorEvent = function (masterEvent) {

  blocklyEventType = masterEvent.type;
  blockName = "-";
  element   = "-";
  blockField= "-"
  newValue  = "-";
  oldValue  = "-";
  currentStudentCode = Blockly.JavaScript.workspaceToCode(Code.workspace);
  rawJSON = masterEvent.toJson(); 

  /*var rawString = masterEvent.toString(); 
  console.log("rawString: " + rawString);
  var blob = new Blob(JSON.stringify(masterEvent.toJson(),null,2),{type : 'application/json'})
  console.log("blob: " + blob); */

  //For all supported Event.type,
  //visit: https://developers.google.com/blockly/guides/configure/web/events

  if (blocklyEventType == Blockly.Events.UI) {
    /*
      element string  One of 'selected', 'category', 'click', 'commentOpen', 'mutatorOpen', 'warningOpen'
      oldValue  value Original value.
      newValue  value Changed value.
    */
    //console.log("UI Event: ");
    element = masterEvent.element;
    newValue = "None";
    oldValue = "None";
    blockName = "None";
    //console.log("   Element: " + element);

    if(element == "click"){
      blockName = Code.workspace.getBlockById(masterEvent.blockId);
      console.log("   blockName: " + blockName);
    }

    else{
      if(masterEvent.newValue !== null){
        newValue = masterEvent.newValue;
        blockName = Code.workspace.getBlockById(newValue);
        //console.log("   newValue: " + newValue);
      }
      if(masterEvent.oldValue !== null){
        oldValue = masterEvent.oldValue;
        blockName = Code.workspace.getBlockById(oldValue);
        //console.log("   oldValue: " + oldValue);
      }
    }
    //console.log("UI Event:" + element + " || " + "blockName:" + blockName + " || " + "blockField:" + "-" + " || " + "oldValue:" + oldValue + " || " + "newValue:" + newValue);

  }
  if(blocklyEventType == Blockly.Events.CHANGE){
    /*
    Blockly.Events.CHANGE

    Change events have four additional properties.

    Name  Type  Description
    element string  One of 'field', 'comment', 'collapsed', 'disabled', 'inline', 'mutate'
    name  string  Name of the field if this is a change to a field.
    oldValue  value Original value.
    newValue  value Changed value.
    */
    //console.log("CHANGE Event: ");

    element = masterEvent.element;
    blockField = masterEvent.name;
    if(masterEvent.oldValue !== null){
      if(masterEvent.oldValue == undefined){
        //console.log("No previous oldValue");
      }
      else{
        oldValue = masterEvent.oldValue;
        //console.log("   oldValue: " + oldValue);
      }
    }
    if(masterEvent.newValue !== null){
      if(masterEvent.newValue == undefined){
        //console.log("No previous oldValue");
      }
      else{
        newValue = masterEvent.newValue;
        //console.log("   oldValue: " + oldValue);
      }
    }
    blockName = Code.workspace.getBlockById(masterEvent.blockId);
    //console.log("CHANGE Event:" + element +  " || " + "blockName:" + blockName + " || " + "blockField:" + blockField +  " || " + "oldValue:" + oldValue + " || " + "newValue:" + newValue);
  }
  if(blocklyEventType == Blockly.Events.CREATE){
    /*
    Blockly.Events.CREATE
    Create events have two additional properties.

    Name  Type  Description
    xml object  An XML tree defining the new block and any connected child blocks.
    ids array An array containing the UUIDs of the new block and any connected child blocks.
    */
    var ids = masterEvent.ids;
    var blocks = new Array(); //readable version from the ids
    //console.log("Create Event: ");
    blockName = Code.workspace.getBlockById(ids[0]); //blockName would just be the parent block containing all children
    for(var i=0; i<ids.length;i++){
      blocks[i] = Code.workspace.getBlockById(masterEvent.ids[i]);
      //console.log("Create Event: " + " || " + "Created Blocks: " + blocks[i]);
    }
    //console.log("CREATE Event:"  + "Created Block(s): " + "blockName:" + blockName + " || " + "blockField:" + "-" +  " || " + "oldValue:" + "-" + " || " + "newValue:" + "-");
  }

  if(blocklyEventType == Blockly.Events.DELETE){

    blockName = Code.workspace.getBlockById(masterEvent.ids[0]); //blockName would just be the parent block containing all children

    /*
      Blockly.Events.DELETE
      Delete events have two additional properties.
      Name  Type  Description
      oldXml  object  An XML tree defining the deleted block and any connected child blocks.
      ids array An array containing the UUIDs of the deleted block and any connected child blocks.
    */
    /*
    var ids = masterEvent.ids;
    var blocks = new Array(); //readable version from the ids
    blockName = Code.workspace.getBlockById(masterEvent.ids[0]); //blockName would just be the parent block containing all children
    for(var i=0; i<ids.length;i++){
      blocks[i] = Code.workspace.getBlockById(masterEvent.ids[i]);
      //console.log("Create Event: " + " || " + "Created Blocks: " + blocks[i]);
    }
    */

    /*var blockID = masterEvent.blockId;
    blockName = Code.workspace.getBlockById(masterEvent.blockId);
    var blockNameIds = Code.workspace.getBlockById(masterEvent.ids[0]);
    //console.log(blockID);
    //console.log(blockNameIds);
    //console.log(masterEvent.toJson());
    console.log("DELETE Event:"  + "Deleted Block(s): " + "blockName:" + blockName + " || " + "blockField:" + "-" +  " || " + "oldValue:" + "-" + " || " + "newValue:" + "-");
    */
  }

  if (blocklyEventType == Blockly.Events.MOVE) {
    /*
    oldParentId string  UUID of old parent block. Undefined if it was a top level block.
    oldInputName  string  Name of input on old parent. Undefined if it was a top level block or parent's next block.
    oldCoordinate object  X and Y coordinates if it was a top level block. Undefined if it had a parent.
    newParentId string  UUID of new parent block. Undefined if it is a top level block.
    newInputName  string  Name of input on new parent. Undefined if it is a top level block or parent's next block.
    newCoordinate object  X and Y coordinates if it is a top level block. Undefined if it has a parent.
    */

    var oldCoordinate = masterEvent.oldCoordinate;
    var newCoordinate = masterEvent.newCoordinate;

    if(JSON.stringify(masterEvent.oldCoordinate)!== undefined){
        oldValue = JSON.stringify(masterEvent.oldCoordinate).replace(/"/g, '');
    }    
    if(JSON.stringify(masterEvent.newCoordinate)!== undefined){
      newValue = JSON.stringify(masterEvent.newCoordinate).replace(/"/g, '');; 
    }

    blockName = Code.workspace.getBlockById(masterEvent.blockId);

    //console.log("MOVE Event:"  + "MOVE Block(s): " + blockName + " || " + "blockField:" + "-" +  " || " + "oldValue:" + oldValue.toString()  + " || " + "newValue:" + newValue.toString());
  }
  //var json = masterEvent.toJson();
  //console.log(json);

  //console.log("localTimeString: " + localTimeString + "; Event Type: " + blocklyEventType + "; BlockID: " + blockID);
  //console.log("Student Code:\n" + currentStudentCode);
  //console.log(masterEvent.toJson());

    if(blockName!=null){
      if(blockName.toString().includes('"')){
          blockName = blockName.toString().replace(/"/g,'');
      }
    }
    rawJSON = JSON.stringify(rawJSON).replace(/"/g, '');

    EventLogging.callPHP(sessionID, blocklyEventType, blockName, element, blockField,newValue,oldValue,currentStudentCode,rawJSON);
}

EventLogging.callPHP = function(aSessionID, anEventType, aBlock, aElement, aBlockField, aNewValue, aOldValue, aStudentCode, aRawJson) {
    console.log("localTimeString: " + localTimeString + "\nSessionID: " + aSessionID.toString() + "\nEvent: " + anEventType.toString() + "\nBlock: " + aBlock.toString() + "\nelement: " + aElement.toString() + "\nblockField: " + aBlockField.toString() + "\nnewValue: " + aNewValue.toString() + "\noldValue: " + aOldValue.toString() + "\nStudent Code: " + aStudentCode.toString() + "\nrawJSON: " + aRawJson.toString());
    console.log("Before setLocalTS in JS");
	EventLogging.setLocalTimestamp();
    console.log("Calling log.php from JS");
    $.post(phpFile,
    {
        event_time_local: localTimeString,
        session: aSessionID,
        event_type: anEventType,
        block: aBlock.toString(),
        element: aElement.toString(),
        blockField: aBlockField.toString(),
        newVal: aNewValue.toString(),
        oldVal: aOldValue.toString(),
        code: aStudentCode,
        //rawJSON:JSON.stringify(aRawJson)
        rawJSON: aRawJson.toString()
        //console.log("JSON.stringify(masterEvent.type): " + JSON.stringify(masterEvent.type,null,2)); 
    });
console.log("After calling log.php from JS");
};

EventLogging.logSessionStart = function(aSessionID) {
    sessionID = aSessionID;
    blocklyEventType = "START_SESSION";

    console.log("Start database logging");
    console.log("SessionID: " + sessionID);
    EventLogging.callPHP(sessionID, blocklyEventType, blockName, element, blockField,newValue,oldValue,currentStudentCode,rawJSON);
};

EventLogging.setLocalTimestamp = function() {
    localTime = new Date();
    var year = localTime.getFullYear();
    var month = (localTime.getMonth() + 1);
    if (month < 10) {
        month = "0" + month;
    }
    var day = localTime.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    var hour = localTime.getHours();
    if (hour < 10) {
        hour = "0" + hour;
    }
    var minute = localTime.getMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    }
    var second = localTime.getSeconds();
    if (second < 10) {
        second = "0" + second;
    }
    localTimeString = "" + year + "-" + month + "-" + day + " "
            + hour + ":" + minute + ":" + second;
};

/*
Step Code Stuff
*/
var myInterpreter = null;

Code.initApi = function (interpreter, scope) {
  // Add an API function for the alert() block.
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    return interpreter.createPrimitive(alert(text));
  };
  interpreter.setProperty(scope, 'alert',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for the prompt() block.
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    return interpreter.createPrimitive(prompt(text));
  };
  interpreter.setProperty(scope, 'prompt',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for highlighting blocks.
  var wrapper = function(id) {
    id = id ? id.toString() : '';
    return interpreter.createPrimitive(Code.highlightBlock(id));
  };
  interpreter.setProperty(scope, 'highlightBlock',
      interpreter.createNativeFunction(wrapper));
}

var highlightPause = false;

Code.highlightBlock = function (id) {
  Code.workspace.highlightBlock(id);
  highlightPause = true;
  console.log("inside highlightBlock(id)");
}

Code.parseCode = function () {
  // Generate JavaScript code and parse it.
  Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  Blockly.JavaScript.addReservedWords('highlightBlock');
  var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
  myInterpreter = new Interpreter(code, Code.initApi);

  alert('Ready to execute this code:\n\n' + code);
  document.getElementById('stepButton').disabled = '';
  highlightPause = false;
  Code.workspace.traceOn(true);
  Code.workspace.highlightBlock(null);
}

Code.stepCode = function() {
  try {
    var ok = myInterpreter.step();
  } finally {
    if (!ok) {
      // Program complete, no more code to execute.
      document.getElementById('stepButton').disabled = 'disabled';
      return;
    }
  }
  if (highlightPause) {
    // A block has been highlighted.  Pause execution here.
    highlightPause = false;
  } else {
    // Keep executing until a highlight statement is reached.
    Code.stepCode();
    console.log("inside stepCode()");
  }
}


/*
Graph Specific Stuff
*/
Code.oldFormula_ = null;

Code.options_ = {
  //curveType: 'function',
  width: 400, height: 400,
  title: 'Population of Bats and Mosquitos',
  titleTextStyle: {
    color: '#01579b', //b6b3b3
    fontSize: 18,
  },
  colors: ['#a52714', '#097138'], //graph color 
  legend: { position: 'bottom' },
  chartArea: {
    color: '#01579b',
    left: '20%', 
    right: '0%',
    width: '95%',
    height: '70%',
  },
  backgroundColor: '#000',
  hAxis: {
    title: 'Time',

    textStyle: {
      color: '#01579b',
      fontSize: 14,
      fontName: 'Arial',
      bold: false,
      italic: false
    },
    titleTextStyle: {
      color: '#01579b',
      fontSize: 16,
      fontName: 'Arial',
      bold: true,
      italic: false
    }
  },
  vAxis: {
    title: 'Population',

    textStyle: {
      color: '#01579b',
      fontSize: 14,
      fontName: 'Arial',
      bold: false,
      italic: false
    },
    titleTextStyle: {
      color: '#01579b',
      fontSize: 16,
      fontName: 'Arial',
      bold: true,
      italic: false
    }
  }
};
/**
 * Drawing options for the Chart API.
 * @type {!Object}
 * @private
 */

/**
 * Visualize the graph of y = f(x) using Google Chart Tools.
 * For more documentation on Google Chart Tools, see this linechart example:
 * https://developers.google.com/chart/interactive/docs/gallery/linechart
 */
Code.drawVisualization = function() {
  var formula = Blockly.JavaScript.workspaceToCode(Code.workspace);
  if (formula === Code.oldFormula_) {
    // No change in the formula, don't recompute.
    return;
  }
  if(formula.includes("highlightBlock")){
    formula = formula.substring(indexOf(");"),formula.length); //making sure things will work with if stuent decided to parse code to debug
  }
  Code.oldFormula_ = formula;

  // Create and populate the data table.

  console.log("Formula: " + formula); 
  var data = google.visualization.arrayToDataTable(Code.plot(formula));
  // Create and draw the visualization, passing in the data and options.
  new google.visualization.LineChart(document.getElementById('visualization')).
      draw(data, Code.options_);

  // Create the "y = ..." label.  Find the relevant part of the code.
  //formula = formula.substring(formula.indexOf('y = '));
  //formula = formula.substring(0, formula.indexOf(';'));
  //var funcText = document.getElementById('funcText');
  //funcText.replaceChild(document.createTextNode(formula), funcText.lastChild);
};

/**
 * Plot points on the function y = f(x).
 * @param {string} code JavaScript code.
 * @return {!Array.<!Array>} 2D Array of points on the Code.
 */
Code.plot = function(code) {
  // Initialize a table with two column headings.
  var table = [];
  var Bat;
  var Mosquito; 
  // TODO: Improve range and scale of Code.
  for (var time = 1; time <= 20; time = Math.round((time + 0.1) * 10) / 10) {
    try {
      eval(code);
    } catch (e) {
      Bat = NaN;
      Mosquito = NaN; 
    }
    if (!isNaN(Bat) && !isNaN(Mosquito)) {
      // Prevent y from being displayed inconsistently, some in decimals, some
      // in scientific notation, often when y has accumulated rounding errors.
      Bat = Math.round(Bat * Math.pow(10, 14)) / Math.pow(10, 14);
      Mosquito = Math.round(Mosquito * Math.pow(10, 14)) / Math.pow(10, 14);
      table.push([time, Bat, Mosquito]);
    }
    else if(!isNaN(Bat)){
      Bat = Math.round(Bat * Math.pow(10, 14)) / Math.pow(10, 14);
      table.push([time, Bat,0]);
    }
    else if(!isNaN(Mosquito)){
      Mosquito = Math.round(Mosquito * Math.pow(10, 14)) / Math.pow(10, 14);
      table.push([time, 0,Mosquito]);
    }
  }
  // Add column heading to table.
  if (table.length) {
    table.unshift(['time', 'Bat', 'Mosquito']);
  } else {
    // If the table is empty, add a [0, 0] row to prevent graph error.
    table.unshift(['time', 'Bat', 'Mosquito'], [0, 0, 0]);
  }
  return table;
};

// Load the Code demo's language strings.
document.write('<script src="msg/' + Code.LANG + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="blocklyAssets/dependencies/msg/js/' + Code.LANG + '.js"></script>\n');

window.addEventListener('load', Code.init);
