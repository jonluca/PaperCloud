<?php
use PHPUnit\Framework\TestCase;

class GetIEEEtest extends TestCase {
	public function testIEEESearchErdos() {
		$author = "erdos";
		exec('php ../get_IEEE_list.php ' . escapeshellarg($author), $output, $return_var);
		$json_output = json_decode($output[0], true);
		$this->assertNotEquals(0, count($json_output));
		$this->assertGreaterThanOrEqual(22, $json_output['totalfound']);
	}

	public function testIEEESearchMiller() {
		$author = "miller";
		exec('php ../get_IEEE_list.php ' . escapeshellarg($author), $output, $return_var);
		$json_output = json_decode($output[0], true);
		$this->assertNotEquals(0, count($json_output));
		$this->assertGreaterThanOrEqual(8554, $json_output['totalfound']);
	}

	public function testIEEESearchHalfond() {
		$author = "Halfond";
		exec('php ../get_IEEE_list.php ' . escapeshellarg($author), $output, $return_var);
		$json_output = json_decode($output[0], true);
		$this->assertNotEquals(0, count($json_output));
		$this->assertGreaterThanOrEqual(18, $json_output['totalfound']);
	}

	public function testACMSearchErdos() {
		$author = "erdos";
		exec('php ../get_ACM_list.php ' . escapeshellarg($author), $output, $return_var);
		$json_output = json_decode($output[2], true);
		$this->assertNotEquals(0, count($json_output));
		//$this->assertEquals("Discovering Facts with Boolean Tensor Tucker Decomposition", $json_output[1]);
	}

	public function testACMSearchMiller() {
		$author = "miller";
		exec('php ../get_ACM_list.php ' . escapeshellarg($author), $output, $return_var);
		$json_output = json_decode($output[2], true);
		$this->assertNotEquals(0, count($json_output));
		$equals = false;
		//The same search sometimes returns different results - these are the two titles it alternates between returning first
		if (in_array("Gossiping in One-dimensional Synchronous Ad Hoc Wireless Radio Networks", $json_output)) {
			$equals = true;
		}
		//$this->assertTrue($equals);

	}
	public function testACMSearchHalfond() {
		$author = "Halfond";
		exec('php ../get_ACM_list.php ' . escapeshellarg($author), $output, $return_var);
		$json_output = json_decode($output[2], true);
		$this->assertNotEquals(0, count($json_output));
		$equals = false;
		//The same search sometimes returns different results - these are the two titles it alternates between returning first
		// if ($json_output[1] == "Finding HTML Presentation Failures Using Image Comparison Techniques" || $json_output[1] == "Web Application Modeling for Testing and Analysis" || $json_output[1]) {
		// 	$equals = true;
		// }
		if (in_array("Optimizing Energy of HTTP Requests in Android Applications", $json_output)) {
			$equals = true;
		}

		//$this->assertTrue($equals);
	}

}

?>
