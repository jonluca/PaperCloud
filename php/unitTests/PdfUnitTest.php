<?php
use PHPUnit\Framework\TestCase;

include("../parse_pdf.php");

class PdfTest extends TestCase {
	private function removeDocumentID($file) {
		$data = file_get_contents($file);
		$data = preg_replace("/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/", "", $data);
		$data = preg_replace("/\/ID \[(.*)\]/", "", $data);
		file_put_contents($file, $data);
		return $data;
	}
	public function testPdfAnnotatingLaguerre() {
		$document = load_document("../pdfs/test.pdf");
		add_javascript($document, "Laguerre");
		$document->setDocCreationTimestamp("");
		$document->setDocModificationTimestamp("");
		file_put_contents("../pdfs/output_from_test.pdf", $document->Output('', 'S'));
		$this->assertEquals(
			$this->removeDocumentID("../pdfs/output_from_test.pdf"),
			$this->removeDocumentID("../pdfs/output.pdf")
		);
	}
}

?>
