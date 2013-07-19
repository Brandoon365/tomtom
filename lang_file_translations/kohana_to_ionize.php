<?php

/**
 *Functions to translate Kohana language files into
 *Ionize readable formats
 */

doEachFile();
 
/**
 *Opens the Kohana lang file directory and runs translateFile with each Kohana file
 *and its matching Ionize file.
 */
function doEachFile() {
    //open Kohana directory
    $kohana_path = getcwd() . '/i18n/';
    if (is_dir($kohana_path)) {
        $kohana_dir = opendir($kohana_path);
    }
    else {
        die('Could not open Kohana lang file directory.');
    }
    
    //loop through files in the kohana directory, find matching ionize file, and translate
    while (($kohana_file = readdir($kohana_dir)) !== false) {
        if(filetype($kohana_path . $kohana_file) != 'dir') {
            //get lang code for current file
            $lang_code = str_replace('.php', '', $kohana_file);
            //open matching folder in Ionize directory
            $ionize_path = getcwd() . '/language/' . $lang_code;
            if (is_dir($ionize_path)) {
                $ionize_dir = opendir($ionize_path);
            }
            else {
                die('Could not open Ionize ' . $lang_code . ' lang file directory.');
            }
            while (($ionize_file = readdir($ionize_dir)) !== false) {
                //if current file is the needed lang file, translate
                if($ionize_file == 'theme_lang.php') {
                    translateFile($kohana_path . '/' . $kohana_file, $ionize_path . '/' . $ionize_file);
                }
            }
        }
    }
    
}

/**
 *Translates Kohana file into Ionize format
 *Takes path of Kohana file as first parameter and path of Ionize file as second
 */
function translateFile($kohana_path, $ionize_path) {
    //import kohana lang array
    $kohana_lang = include($kohana_path);
    //import ionize lang array
    $ionize_file = file($ionize_path);
    $ionize_file = checkForReturn($ionize_file);

    file_put_contents($ionize_path,$ionize_file);
    $ionize_file = file($ionize_path);
    $ionize_lang = include($ionize_path);

    //get index to start adding entries to ionize file at
    foreach($ionize_file as $index=>$item) {
        if(strpos($item, 'return $lang')!== false) {
            $appendLine = $index;
        }
    }
   
    
    /**
     *For each entry in the kohana lang file,
     *check if it exists in the ionize lang file.
     *If it does and translation matches, skip over
     *Else update existing entry or append new entry to file
     */
    foreach($kohana_lang as $key=>$entry) {
        $key_with_slash = str_replace("'", "\'", $key);
        $entry_with_slash = str_replace("'", "\'", $entry);
    
        //check if entry exists
        if(isset($ionize_lang[$key])) {
            //get line from ionize file of entry
            foreach($ionize_file as $index=>$item){
                if(strpos($item,'$lang[' . $key . ']')!== false){
                $line_number = $index;
                }
            }
            //check if entries match
            if($ionize_lang[$key] != $entry) {
                $ionize_file[$line_number] = '$lang[\'' . $key_with_slash . '\'] = \'' . $entry_with_slash . '\';' . PHP_EOL; 
            }
        }
        //if entry does not exist, insert it
        else {
            $ionize_file[$appendLine] = '$lang[\'' . $key_with_slash . '\'] = \'' . $entry_with_slash . '\';' . PHP_EOL;
            $appendLine++;
        }
    }
    
    //check to see if return $lang exists, if not add it to end of file
    $ionize_file = checkForReturn($ionize_file);
    
    file_put_contents($ionize_path,$ionize_file);
}

/**
 *Takes Ionize file array as parameter
 *Checks if return $lang exists in the file and adds it if not
 */
function checkForReturn($file) {
    $return_exists = false;
    $line_count = 0;
    $end_line = NULL;
    foreach($file as $item){
        if(strpos($item,'return $lang')!== false){
        $return_exists = true;
        $line_count++;
        }
        elseif(strpos($item,'?>') !== false) {
            $end_line = $line_count;
        }
        else {
            $line_count++;
        }
    }
    if($end_line == NULL) {
        $end_line = $line_count;
    }
    
    if(!$return_exists) {
        $file[$end_line] = 'return $lang;' . "\n";
        $file[$end_line+1] = '?>';
    }
    
    return $file;
}
