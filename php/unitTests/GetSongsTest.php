<?php
	use PHPUnit\Framework\TestCase;

	class GetSongsTest extends TestCase {

		public function testRealArtistIdWithSongs(){
			exec('php ../get_songs.php 19RHMn8FFkEFmhPwyDW2ZC', $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertNotEquals(0, count($output);
			$this->assertNotEquals(count($json_output), 0);
		}


		public function testGetsCorrectNumberOfTracks(){
			exec('php ../get_songs.php 4dpARuHxo51G3z768sgnrY', $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertNotEquals(0, count($output);
			$this->assertEquals(count($json_output), 10);
		}

		public function testArtistWithFewTracks(){
			exec('php ../get_songs.php 0SAalijWMXGtNXbUjeBVth', $output, $return_var);
			$json_output = json_decode($output[0],true);
			$this->assertNotEquals(0, count($output);
			$this->assertNotEquals(count($json_output), 0);
			$this->assertEquals(count($json_output), 1);
		}

	}

?>