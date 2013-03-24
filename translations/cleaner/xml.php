<?php
/*
                                  ____   _____
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___
                 / _ \ | | |/ _ \ |  | |\___ \
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/
                       __/ |
                      |___/

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - www.eyeos.org/team

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2009 eyeOS Team (team@eyeos.org)
*/

function xml_read($file) {
	return xml_read_intern(@file_get_contents($file));
}

function xml_read_intern($content) {
	$content_old = $content;
	$content = strstr($content,'<');
	$end = strstr($content,'>');
	if (!$content || !$end) {
		$content_old = str_replace('&nbsp;',' ',$content_old);
		return @html_entity_decode($content_old,ENT_QUOTES,'UTF-8');
	}
	while ($content && $end) {
		$full_tag = substr($content,1,-strlen($end));
		if (strpos($full_tag,' ')) {
			$tag = substr($full_tag,0,strpos($full_tag,' '));
		} else {
			$tag = $full_tag;
		}
		if ($tag{0} == '/' || $full_tag{strlen($full_tag) - 1} == '/') {
			$content = substr($end,1);
		} elseif ($tag{0} == '?') {
			$content = substr(strstr($content,'?>'),2);
		} elseif (substr($tag,0,3) == '!--') {
			$content = substr(strstr($content,'-->'),3);
		} else {
			$tag_end = strstr($content,'</' . $tag . '>');
			$tag_content = substr($end,1,strlen($end) - 1 - strlen($tag_end));
			$tag_end = substr($tag_end,strlen('</' . $tag . '>'));
			while ((substr_count($tag_content,'<' . $tag . '>') + substr_count($tag_content,'<' . $tag . ' ') - substr_count($tag_content,'</' . $tag . '>')) && strpos($tag_end,'</' . $tag . '>')) {
				$tag_end = strstr($tag_end,'</' . $tag . '>');
				$tag_content = substr($end,1,strlen($end) - 1 - strlen($tag_end));
				$tag_end = substr($tag_end,strlen('</' . $tag . '>'));
			}
			$content = $tag_end;
			$tag = str_replace('&nbsp;',' ',$tag);
			$tag = @html_entity_decode($tag,ENT_QUOTES,'UTF-8');
			$return[$tag][] = xml_read_intern($tag_content);
		}
		$content = strstr($content,'<');
		$end = strstr($content,'>');
	}
	return $return;
}

function xml_write($file,$array) {
	return file_put_contents($file,xml_write_intern($array));
}

function xml_write_intern($array,$tabs = -1) {
	$tabs++;
	foreach ($array as $key => $value) {
		$key = htmlspecialchars($key,ENT_NOQUOTES,'UTF-8');
		$key = str_replace('?','&#63;',$key);
		$key = str_replace('!','&#33;',$key);
		$key = str_replace(' ','&nbsp;',$key);
		$key = str_replace('/','&#47;',$key);
		if (is_array($value)) {
			foreach ($value as $current) {
				$return .= str_pad('',$tabs,"\t") . '<' . $key . '>';
				if (is_array($current)) {
					$return .= "\n" . xml_write_intern($current,$tabs) . "\n" . str_pad('',$tabs,"\t");
				} else {
					$return .= htmlspecialchars($current,ENT_NOQUOTES,'UTF-8');
				}
				$return .= '</' . $key . '>' . "\n";
			}
		}
	}
	return trim($return,"\n");
}
?>