<?php
	use PHPUnit\Framework\TestCase;

	class GetLyricsTest extends TestCase {
		public function testRealArtistAndAllRealSongs(){
			$songs = [
			    0 => "hello",
			    1 => "skyfall",
			];
			exec('php ../get_lyrics.php adele '.escapeshellarg(serialize($songs)), $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertNotEquals(0, count($json_output));
			$this->assertEquals(array_key_exists("skyfall", $json_output), true);
			$this->assertEquals(array_key_exists("hello", $json_output), true);

		}

		public function testMultiWordArtistAndAllRealSongs(){
			$songs = [
			    0 => "bad",
			    1 => "thriller",
			];
			exec('php ../get_lyrics.php michaeljackson '.escapeshellarg(serialize($songs)), $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertNotEquals(0, count($json_output));
			$this->assertEquals(array_key_exists("bad", $json_output), true);
			$this->assertEquals(array_key_exists("thriller", $json_output), true);
		}

		public function testArtistAndSomeMultiWordSongs(){
			$songs = [
			    0 => "smoothcriminal",
			    1 => "maninthemirror",
			];
			exec('php ../get_lyrics.php michaeljackson '.escapeshellarg(serialize($songs)), $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertNotEquals(0, count($json_output));
			$this->assertEquals(array_key_exists("smoothcriminal", $json_output), true);
			$this->assertEquals(array_key_exists("maninthemirror", $json_output), true);
		}

		public function testRealArtistAndSomeFakeSongs(){
			$songs = [
			    0 => "bad",
			    1 => "thriller",
			    2 => "donutmonkey"
			];
			exec('php ../get_lyrics.php michaeljackson '.escapeshellarg(serialize($songs)), $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertNotEquals(0, count($json_output));
			$this->assertEquals(array_key_exists("bad", $json_output), true);
			$this->assertEquals(array_key_exists("thriller", $json_output), true);
			$this->assertEquals(array_key_exists("donutmonkey", $json_output), false);
		}

		public function testRealArtistAndAllFakeSongs(){
			$songs = [
			    0 => "dorathytheexplorer",
			    1 => "johnnyappleseeder",
			    2 => "donutmonkey"
			];
			exec('php ../get_lyrics.php michaeljackson '.escapeshellarg(serialize($songs)), $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertEquals(0, count($json_output));
			$this->assertEquals(array_key_exists("dorathytheexplorer", $json_output), false);
			$this->assertEquals(array_key_exists("johnnyappleseeder", $json_output), false);
			$this->assertEquals(array_key_exists("donutmonkey", $json_output), false);

		}

		public function testFakeArtistAndAllRealSongs(){
			$songs = [
			    0 => "bad",
			    1 => "thriller",
			];
			exec('php ../get_lyrics.php zacharydenham '.escapeshellarg(serialize($songs)), $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertEquals(0, count($json_output));
			$this->assertEquals(array_key_exists("bad", $json_output), false);
			$this->assertEquals(array_key_exists("thriller", $json_output), false);

		}
		
		public function testLongArrayOfSongs(){
			$songs = [
			    0 => "bad",
			    1 => "thriller",
			    2 => "billyjean",
			    3 => "beatit",
			    4 => "maninthemirror",
			    5 => "blackorwhite",
			    6 => "thewayyoumakemefeel",
			];

			exec('php ../get_lyrics.php michaeljackson '.escapeshellarg(serialize($songs)), $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertNotEquals(count($json_output), 0);

			//after manually searching the api, only 5 of the 7 were supported
			$this->assertEquals(count($json_output), 5);
		}

		public function testEmptySongs(){
			$songs = [
				1 => ""
			];
			exec('php ../get_lyrics.php michaeljackson '.escapeshellarg(serialize($songs)), $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertEquals(0, count($json_output));
		}

		public function testNumericSongs(){
			$songs = [
			    0 => "134719328470",
			    1 => "1343982341",
			];
			exec('php ../get_lyrics.php michaeljackson '.escapeshellarg(serialize($songs)), $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertEquals(0, count($json_output));
		}

		public function testNumericArtist(){
			$songs = [
			    0 => "bad",
			    1 => "thriller",
			];
			exec('php ../get_lyrics.php 9080984 '.escapeshellarg(serialize($songs)), $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertEquals(0, count($json_output));
		}
	}

?>