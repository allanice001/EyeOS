#!/usr/bin/perl

$numArgs = $#ARGV + 1;
if($numArgs < 2) {
	print "You need to specify a language to convert and a encoding\n";
	exit;
}

$lang = $ARGV[0];
$encoding = $ARGV[1];

$directory = ".";
foreach $f (<$directory/*>) {
	if (-d $f."/lang/".$lang."/") {
		$langDir = $f."/lang/".$lang;
		foreach $l (<$langDir/*>) {
			system("iconv --from-code=".$encoding." --to-code=UTF-8 ".$l." > ".$langDir."/lol.js");
			system("mv ".$langDir."/lol.js ".$l);			
		}	
	}
}
