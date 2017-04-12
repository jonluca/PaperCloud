<?php

include 'vendor/autoload.php';

class_exists('TCPDF', true); // hacky stuff

function load_document($filename) {
 $parser = new FPDI();
 $npages = $parser->setSourceFile($filename);
 for ($i = 0; $i < $npages; $i++) {
  $page = $parser->importPage($i+1);
  $parser->AddPage();
  $parser->useTemplate($page);
 }
 return $parser;
}

function add_javascript($document, $word) {
 $script =
<<<EOD
for (var i = 0; i < this.numPages; i++) {
 var numWords = this.getPageNumWords(i);
 for (var j = 0; j < numWords; j++) {
  var word = this.getPageNthWord(i, j); // go through every word in the document
  if (word == "$word") {
   //app.alert([i, j, word])
   this.addAnnot({
    page: i,
    type: "Highlight",
    strokeColor: color.yellow,
    quads: this.getPageNthWordQuads(i, j),
    author: "PaperCloud",
    contents: "frequent word"
   })
  }
 }
}
EOD;
 $document->addJavascriptObject($script, true);
}

function get_raw_text($file) {
 if (is_null($file) || $file == "" || $file == null) {
 	return "";
 } else {
 	$parser = new \Smalot\PdfParser\Parser();
 	$pdf = $parser->parseFile($file);
 	$text = $pdf->getText();
 	return $text;
 }
}

?>
