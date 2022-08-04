# Engage Blockly

==============

![Blockly](./Engage_Header2.png?raw=true "Engage_Header2")

Overview
--------

* Blockly: a visual library for manipulating a block canvas that can generate equivalent textual code in a variety of languages

Installation
------------

First, clone it locally. This could take a little while.

    > git clone https://github.com/google/blockly.git


You'll need to build Blockly. Both of these depend on the Closure Compiler, so you'll need to put that in the empty `closure-library` folder. You can follow the [Blockly instructions here] (https://developers.google.com/blockly/hacking/closure) , but the gist will be:

    > wget https://github.com/google/closure-library/zipball/master -O closure.zip
    > unzip closure.zip

CD into the new blockpy directory

    > cd blockpy/

And add the relevant subtree information to your .git/config:

    > vi .git/config

Replace the contents of that file with the information found here: http://pastebin.com/raw/QWpJjgU3 (TODO: show the actual commands used to set this)

Next, you'll need to build Blockly:

    > cp blockly/msg/en.js en.js
    > cd blockly
    > python build.py
    > cd ..
    > mv en.js blockly/msg/en.js

If you make edits to Blockly, you'll need to rerun their build commands.

    > python build.py
--------
## Helpful Resources & Tips - Xiaoxi Zheng

[Blockly Github Wiki](https://github.com/google/blockly/wiki)

[Blockly Developers Page ](https://developers.google.com/blockly/guides/overview)

[Event Logging Documentation](https://developers.google.com/blockly/guides/configure/web/events)

Example User input: Visit the index.html under [Blockly->demos->code] folder. [Text] -> [Prompt for [text] with [message]]

About Changing Block Colors, please read [this](https://github.com/google/blockly/issues/23):

Google has specifically locked changing block colors with the following constants to retain an overall look & feel of a style. Individual blocks are only allowed to change the HUE of the HSV value. The following constant can be found and change in Blockly->Core->constants.js;

  ```javascript
  /* Blockly->Core->constants.js
  Blockly.HSV_SATURATION = 0.45;
  Blockly.HSV_VALUE = 0.65;
  ```

  Remember to rebuild Blockly with core changes to Blockly!

  >  python build.py


Commands
--------
Running on a local server:
  > php -S localhost:8000
