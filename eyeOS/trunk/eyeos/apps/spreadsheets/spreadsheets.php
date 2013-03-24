<?php

require dirname(__FILE__) . '/libs/pChart/pChart/pData.class';
require dirname(__FILE__) . '/libs/pChart/pChart/pChart.class';
require dirname(__FILE__) . '/libs/ods.php';

abstract class SpreadsheetsApplication extends EyeosApplicationExecutable {

	public static function __run(AppExecutionContext $context, MMapResponse $response) {
	if ($context->getIncludeBody()) {
		$buffer = '';
		$itemsPath = EYE_ROOT . '/' . APPS_DIR . '/spreadsheets';
		$buffer .= file_get_contents($itemsPath . '/bars/genericbar.both.Actions.js');
		$buffer .= file_get_contents($itemsPath . '/bars/genericbar.menubar.Items.js');
		$buffer .= file_get_contents($itemsPath . '/bars/genericbar.toptoolbar.Items.js');
		$buffer .= file_get_contents($itemsPath . '/bars/genericbar.bottomtoolbar.basic.Items.js');
		$buffer .= file_get_contents($itemsPath . '/libs/MathProcessor.js');
		$buffer .= file_get_contents($itemsPath . '/eyeos.sps.Sheet.js');
		$buffer .= file_get_contents($itemsPath . '/eyeos.sps.celleditor.Default.js');
		$buffer .= file_get_contents($itemsPath . '/eyeos.sps.cellrenderer.Default.js');
		$buffer .= file_get_contents($itemsPath . '/eyeos.sps.columnmodel.Basic.js');
		$buffer .= file_get_contents($itemsPath . '/eyeos.sps.model.Simple.js');
		$buffer .= file_get_contents($itemsPath . '/eyeos.sps.pane.Header.js');
		$buffer .= file_get_contents($itemsPath . '/eyeos.sps.pane.Scroller.js');
		$buffer .= file_get_contents($itemsPath . '/eyeos.sps.pane.Pane.js');
		$buffer .= file_get_contents($itemsPath . '/eyeos.sps.rowrenderer.Default.js');
		$buffer .= file_get_contents($itemsPath . '/eyeos.sps.table.Table.js');
		$buffer .= file_get_contents($itemsPath . '/eyeos.sps.pane.Scroller.js');

//			$itemsPath = EYE_ROOT . '/' . APPS_DIR . '/spreadsheets';
//			$dir = new DirectoryIterator($itemsPath);
//			foreach($dir as $file) {
//				$fileName = $file->getBasename();
//				if (!$file->isDot() && $fileName{0} != '.' && strchr($fileName, '.js')) {
//					$buffer .= file_get_contents($itemsPath . '/' . $fileName);
//				}
//			}

		$response->appendToBody($buffer);
	}
}

	public static function openFile ($params) {
		$file = FSI::getFile($params[0]);
		$object = parseOds($file->getRealFile()->getPath());
		$sheets = $object->sheets;
		$dataBulk = array();
		for ($i = 0; $i < count($sheets); $i++) {
			$dataBulk[$i] = array();
			$sheet = $sheets[$i]['rows'];
			for ($j = 0; $j < count($sheet); $j++) {
				$temp = array();
				for ($x = 0; $x < count($sheet[$j]); $x++) {
					if (is_array($sheet[$j][$x]['attrs'])) {
						$temp[] = (string) $sheet[$j][$x]['value'];;
					} else {
						$temp[] = (integer) $sheet[$j][$x]['value'];
					}
					
				}
				$dataBulk[$i][$j] = $temp;
			}
		}

		return $dataBulk;
	}

	public static function saveFile ($params) {
		$dirName = dirname(__FILE__);
		$object = newOds(); //create a new ods file

		$myFile = FSI::getFile($params[0]);
		$myRealFile = $myFile->getRealFile();
		$fileToSave = AdvancedPathLib::getPhpLocalHackPath($myRealFile->getPath());

		for ($i = 0; $i < count($params[1]); $i++) {
			$sheets = $params[1][$i];
			$sheet = $i;
			for ($f = 0; $f < count($sheets); $f++) {
				$rows = $sheets[$f];
				$row = $f;
				for ($j = 0; $j < count($rows); $j++) {
					if ($rows[$j] == NULL || $rows[$j] == 'NaN') {
						$rows[$j] = " ";
					}
					$columns = $rows[$j];
					$column = $j;
					for ($x = 0; $x < count($columns); $x++) {
						$value = $columns;
						//echo "$sheet $row $column $value\n";
						if (substr($value, 0, 1) == "=") {
							$object->addFormula($sheet, $row, $column, $value);
						} else if (is_integer($value)) {
							$object->addCell($sheet, $row, $column, $value, 'float');
						} else {
							$object->addCell($sheet, $row, $column, $value, 'string');
						}
					}
					
				}
			}
		}
		//var_dump($object);

		saveOds($object, $fileToSave);
		//save the object to a ods file
	}

   public static function createGraphic($params) {
	   $dirName = dirname(__FILE__);
	   $DataSet = new pData();
	   for ($i = 0; $i < count($params); $i++) {
		   $f = $i + 1;
		   $name = (string) "Serie$f";
		   //var_dump($name);
		   //var_dump($params[$i]);
		   $DataSet->AddPoint($params[$i],$name);
	   }
	   $DataSet->AddAllSeries();
	   $DataSet->SetAbsciseLabelSerie();
	   for ($i = 0; $i < count($params); $i++) {
		   $f = $i + 1;
		   $name = (string) "Serie$f";
		   $DataSet->SetSerieName($i, $name);
	   }
	   
		// Initialise the graph
	   $Test = new pChart(700,230);
	   $Test->setFontProperties($dirName . "/libs/pChart/Fonts/tahoma.ttf",8);
	   $Test->setGraphArea(50,30,680,200);
	   $Test->drawFilledRoundedRectangle(7,7,693,223,5,240,240,240);
	   $Test->drawRoundedRectangle(5,5,695,225,5,230,230,230);
	   $Test->drawGraphArea(255,255,255,TRUE);
	   $Test->drawScale($DataSet->GetData(),$DataSet->GetDataDescription(),SCALE_NORMAL,150,150,150,TRUE,0,2,TRUE);
	   $Test->drawGrid(4,TRUE,230,230,230,50);

		// Draw the 0 line
	   $Test->setFontProperties("Fonts/tahoma.ttf",6);
	   $Test->drawTreshold(0,143,55,72,TRUE,TRUE);

	   // Draw the bar graph
	   $Test->drawBarGraph($DataSet->GetData(),$DataSet->GetDataDescription(),TRUE);

	   // Finish the graph
	   $Test->setFontProperties($dirName . "/libs/pChart/Fonts/tahoma.ttf", 8);
	   $Test->drawLegend(600, 30,$DataSet->GetDataDescription(),255, 255, 255);
	   $Test->setFontProperties($dirName . "/libs/pChart/Fonts/tahoma.ttf",10);
	   $Test->drawTitle(50, 22,"Example 1", 50, 50, 50, 585);
	   $image = $dirName . "/tmp/graph1.png";
	   $Test->Render($image);
	   return 'graph1.png';
   }

   public static function getImage($params) {
	   $fileName = basename($params);
	   $path = dirname(__FILE__) . '/tmp/' . $fileName;
	   $response = MMapManager::getCurrentResponse();
	   $response->getHeaders()->append('Content-Type: image/png');
	   $response->setBodyRenderer(new FileReaderBodyRenderer(new FileInputStream($path)));
   }
}
?>
