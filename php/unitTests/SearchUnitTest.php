<?php
	use PHPUnit\Framework\TestCase;

	class GetLyricsTest extends TestCase {
		public function testIEEESearchErdos(){
			$author = "erdos";
			exec('php ../get_IEEE_list.php '.escapeshellarg($author), $output, $return_var);
			$json_output = json_decode($output[0], true);
			$this->assertNotEquals(0, count($json_output));
			$this->assertEquals(22, $json_output['totalfound']);
		}

		public function testIEEESearchMiller(){
			$author = "miller";
			exec('php ../get_IEEE_list.php '.escapeshellarg($author), $output, $return_var);
			$json_output = json_decode($output[0], true);
			$this->assertNotEquals(0, count($json_output));
			$this->assertEquals(8554, $json_output['totalfound']);
		}

		public function testIEEESearchHalfond(){
			$author = "William Halfond";
			exec('php ../get_IEEE_list.php '.escapeshellarg($author), $output, $return_var);
			$json_output = json_decode($output[0], true);
			$this->assertNotEquals(0, count($json_output));
			$this->assertEquals(18, $json_output['totalfound']);
		}

	}

?>