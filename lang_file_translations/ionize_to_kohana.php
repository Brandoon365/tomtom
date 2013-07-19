<?php

/**
 *Functions to translate Ionize language files into
 *Kohana readable formats
 */

doEachFile();
 
/**
*Opens the Ionize lang file directory and runs translateFile with each Ionize file
*and its matching Kohana file.
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
    
    //open Ionize directory
    $ionize_path = getcwd() . '/language/';
    if (is_dir($ionize_path)) {
        $ionize_top_dir = opendir($ionize_path);
    }
    else {
        die('Could not open Ionize lang file directory.');
    }
    
    //loop through each folder in the Ionize directory
    while (($ionize_lang_folder = readdir($ionize_top_dir)) !== false) {
        if(filetype($ionize_path . $ionize_lang_folder) == 'dir') {
            //find theme_lang file in each folder
            $lang_code = $ionize_lang_folder;
            $ionize_dir = opendir($ionize_path . '/' . $ionize_lang_folder);
            
            while (($ionize_file = readdir($ionize_dir)) !== false) {
                if($ionize_file == 'theme_lang.php') {
                    //check if matching kohana file exists
                    while (($kohana_file = readdir($kohana_dir)) !== false) {
                        if($kohana_file == $lang_code . '.php') {
                            translateFile($kohana_path . $kohana_file, $ionize_path . $lang_code . '/' . $ionize_file);
                        }
                    }
                    $kohana_dir = opendir($kohana_path);
                }
            }
        }
    }
}

/**
 *Translates Ionize file into Kohana format
 *Takes path of Kohana file as first parameter and path of Ionize file as second
 */
function translateFile($kohana_path, $ionize_path) {
    //import kohana lang array
    $kohana_lang = include($kohana_path);
    $kohana_file = file($kohana_path);
    
    //import ionize lang array
    $ionize_file = file($ionize_path);
    checkForReturn($ionize_file);
    file_put_contents($ionize_path,$ionize_file);
    $ionize_lang = include($ionize_path);
    
    //get index to start adding entries to kohana file at
    foreach($kohana_file as $index=>$item) {
        if(strpos($item, ');')!== false) {
            $appendLine = $index;
        }
    }
    
    /**
     *For each entry in the ionize lang file,
     *check if it exists in the kohana lang file.
     *If it does and translation matches, skip over
     *Else update existing entry or append new entry to file
     */
    foreach($ionize_lang as $key=>$entry) {
        $key_with_slash = str_replace("'", "\'", $key);
        $entry_with_slash = str_replace("'", "\'", $entry);
        
        //check if entry exists
        if(isset($kohana_lang[$key])) {
            //get line from kohana file of entry
            foreach($kohana_file as $index=>$item){
                if(strpos($item,'$lang[' . $key . ']')!== false){
                $line_number = $index;
                }
            }
            //check if entries match
            if($kohana_lang[$key] != $entry) {
                $kohana_file[$line_number] = '\'' . $key_with_slash . '\' => \'' . $entry_with_slash . '\',' . PHP_EOL; 
            }
        }
        //if entry does not exist, insert it
        else {
            $kohana_file[$appendLine] = '\'' . $key_with_slash . '\' => \'' . $entry_with_slash . '\',' . PHP_EOL;
            $appendLine++;
        }
    }
    $kohana_file[$appendLine] = ');';
    
    file_put_contents($kohana_path,$kohana_file);
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

