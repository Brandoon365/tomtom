<?php

/**
 *Functions to translate Ionize language files into
 *Kohana readable formats
 */

//import kohana lang array
$kohana_lang = include('kohana\de.php');
$kohana_file = file('kohana\de.php');
//import ionize lang array
$ionize_lang = include('ionize\theme_lang.php');

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

file_put_contents('kohana\de.php',$kohana_file);
