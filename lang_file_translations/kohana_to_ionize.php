<?php

/**
 *Functions to translate Kohana language files into
 *Ionize readable formats
 */

//import kohana lang array
$kohana_lang = include('kohana\de.php');
//import ionize lang array
$ionize_lang = include('ionize\theme_lang.php');
$ionize_file = file('ionize\theme_lang.php');

//get index to start adding entries to ionize file at
foreach($ionize_file as $index=>$item) {
    if(strpos($item, 'return $lang;')!== false) {
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
$return_exists = false;
foreach($ionize_file as $item){
    if(strpos($item,'return $lang')!== false){
    $return_exists = true;
    }
}

if(!$return_exists) {
    $ionize_file[sizeof($ionize_file)+1] = 'return $lang' . "\n";
    $ionize_file[sizeof($ionize_file)+2] = '?>';
}


file_put_contents('ionize\theme_lang.php',$ionize_file);
