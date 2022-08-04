/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var EventLogging = {};
var phpFile = "log-data.php";
var localTime = new Date();
var localTimeString = "";
var computerID = -1;
var eventType = "";

EventLogging.callPHP = function(anEventType, aBlock, aParam, someScripts) {
    console.log("Event: " + anEventType + "; Block: " + aBlock + "; Param: " + aParam + "\nScript: " + someScripts);
    EventLogging.setLocalTimestamp();
    $.post(phpFile,
    {
        event_time_local: localTimeString,
        computer_id: computerID,
        event_type: anEventType,
        block: aBlock,
        param: aParam,
        scripts: someScripts
    });
};

EventLogging.logSessionStart = function(aSessionID) {
    computerID = aSessionID;
    eventType = "SESSION_START";
    block = "-";
    param = "-";
    scripts = "-";
    console.log("Start database logging");
    console.log("SessionID: " + sessionID);
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logCreateBlock = function(aBlock) {
    eventType = "BLOCK_CREATE";
    block = EventLogging.getBlockSpec(aBlock);
    param = "-";
    scripts = "-";
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logGrabBlock = function(aBlock, theScripts) {
    eventType = "BLOCK_GRAB";
    block = EventLogging.getBlockSpec(aBlock);
    param = "-";
    scripts = EventLogging.getScripts(theScripts);
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logSnapBlock = function(aBlock, theScripts) {
    eventType = "BLOCK_SNAP";
    block = EventLogging.getBlockSpec(aBlock);
    param = "-";
    scripts = EventLogging.getScripts(theScripts);
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logDeleteBlock = function(aBlock) {
    eventType = "BLOCK_DELETE";
    block = EventLogging.getBlockSpec(aBlock);
    param = "-";
    scripts = "-";
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logUnsnapBlock = function(aBlock, theScripts) {
    eventType = "BLOCK_UNSNAP";
    block = EventLogging.getBlockSpec(aBlock);
    param = "-";
    scripts = EventLogging.getScripts(theScripts);
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logDropBlock = function(aBlock, theScripts) {
    eventType = "BLOCK_DROP";
    block = EventLogging.getBlockSpec(aBlock);
    param = "-";
    scripts = EventLogging.getScripts(theScripts);
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logStartParamEdit = function(aBlock, theScripts) {
    eventType = "PARAM_EDIT_START";
    block = EventLogging.getBlockSpec(aBlock);
    param = "-";
    scripts = EventLogging.getScripts(theScripts);
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logEndParamEdit = function(aBlock, aParam, theScripts) {
    eventType = "PARAM_EDIT_END";
    block = EventLogging.getBlockSpec(aBlock);
    param = aParam;
    scripts = EventLogging.getScripts(theScripts);
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logParamSelect = function(aBlock, aParam, theScripts) {
    eventType = "PARAM_SELECT";
    block = EventLogging.getBlockSpec(aBlock);
    param = aParam;
    scripts = EventLogging.getScripts(theScripts);
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logStartInputTyping = function() {
    eventType = "INPUT_TYPING_START";
    block = "-";
    param = "-";
    scripts = "-";
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logEndInputTyping = function(aParam) {
    eventType = "INPUT_TYPING_END";
    block = "-";
    param = aParam;
    scripts = "-";
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logCategorySwitch = function(aCategory) {
    eventType = "CATEGORY_SWITCH";
    block = aCategory;
    param = "-";
    scripts = "-";
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logSpriteSwitch = function(aSprite) {
    eventType = "SPRITE_SWITCH";
    block = aSprite;
    param = "-";
    scripts = "-";
    EventLogging.callPHP(eventType, block, param, scripts);
};

EventLogging.logProgramRun = function() {
    eventType = "PROGRAM_RUN";
    block = "-";
    param = "-";
    scripts = "-";
    EventLogging.callPHP(eventType, block, param, scripts);
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

EventLogging.getBlockSpec = function(aBlock) {
    var name = "";
    var child = null;
    var childIndex = 0;
    var childSpec = aBlock.blockSpec.split(/[ ]+/);
    for (var x = 0; x < aBlock.children.length; x++) {
        child = aBlock.children[x];
        if ((child instanceof ShadowMorph) || (childIndex >= childSpec.length)) {
            continue;
        }
        if (childSpec[childIndex].indexOf("%") !== -1) {
            if (child instanceof CommandSlotMorph) {
                name += "{<body>} ";
            }
            else {
                name += "(";
                if ((child instanceof BooleanSlotMorph) || (child instanceof ReporterBlockMorph)) {
                    name += "<condition>";
                }
                else if (child instanceof BlockMorph) {
                    name += child.blockSpec + " [" + child.blockID + "]";
                }
                else if (child instanceof SymbolMorph) {
                    name += child.name;
                }
                else {
                    //name += child.children[0].text;
                }
                name += ") ";
            }
        }
        else {
            name += child.text + " ";
        }
        childIndex++;
    }
    name += "[" + aBlock.blockID + "]";
    return name;
};

EventLogging.getScripts = function(aScriptsMorph) {
    //XML script parsing
    var myserializer = new SnapSerializer();
    var scriptsText = encodeURIComponent(myserializer.serialize(aScriptsMorph));
//    //Original script parsing:
//    var scriptsText = "";
//    if (aScriptsMorph === null) {
//        return "No script associated with block";
//    }
//    var scripts = aScriptsMorph.children;
//    for (var x = 0; x < scripts.length; x++) {
//        scriptsText += "//START\n";
//        scriptsText += EventLogging.getScriptsHelper(scripts[x], "");
//        scriptsText += "//END\n";
//    }
    return scriptsText;
};

EventLogging.getScriptsHelper = function(aBlock, tab) {
    var scriptsText = tab;
    if (aBlock instanceof BoxMorph) {
        return scriptsText;
    }
    var child = null;
    var childIndex = 0;
    var childSpec = aBlock.blockSpec.split(/[ ]+/);
    var placeID = true;
    for (var x = 0; x < aBlock.children.length; x++) {
        child = aBlock.children[x];
        //Appears when creating a block
        if (child instanceof ShadowMorph) {
            continue;
        }

        //More blocks connected to this one
        if (childIndex >= childSpec.length && child instanceof BlockMorph) {
            placeID = false;
            scriptsText += "[" + aBlock.blockID + "]\n" + EventLogging.getScriptsHelper(child, tab);
        }

        //Parameter or C-slot
        else if (childSpec[childIndex].indexOf("%") !== -1) {
            //Command slot for loops/conditionals
            if (child instanceof CommandSlotMorph) {
                placeID = false;
                scriptsText += "[" + aBlock.blockID + "] {\n";
                for (var y = 0; y < child.children.length; y++) {
                    scriptsText += EventLogging.getScriptsHelper(child.children[y], (tab + "\t"));
                }
                scriptsText += tab + "}\n";
            }
            //Parameter
            else {
                scriptsText += "(";
                //Empty boolean slot
                if (child instanceof BooleanSlotMorph) {
                    scriptsText += "";
                }
                //Reporter or predicate block
                else if (child instanceof ReporterBlockMorph) {
                    scriptsText += EventLogging.getScriptsHelper(child, "");
                    scriptsText = scriptsText.substring(0, scriptsText.length - 1);
                }
                //Symbols (i.e., green flag)
                else if (child instanceof SymbolMorph) {
                    scriptsText += child.name;
                }
                //Textual parameter
                else {
                    scriptsText += child.children[0].text;
                }
                scriptsText += ") ";
            }
        }
        else {
            //Add tab to "else" of if/else
            if (child.text === "else") {
                scriptsText += tab + child.text + " ";
            }
            //Default case: text within a block
            else {
                scriptsText += child.text + " ";
            }
        }
        childIndex++;
    }
    if (placeID) {
        scriptsText += "[" + aBlock.blockID + "]\n";
    }

    return scriptsText;
//    var scriptsTextHelper = "";
//    scriptsTextHelper = aBlockMorph.blockSpec;
//    scriptsTextHelper += ";\n";
//    if (aBlockMorph.children[aBlockMorph.children.length - 1] instanceof BlockMorph) {
//        scriptsTextHelper += EventLogging.getScriptsHelper(aBlockMorph.children[aBlockMorph.children.length - 1]);
//    }
//    return scriptsTextHelper;
};
