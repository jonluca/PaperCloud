<?php
	use PHPUnit\Framework\TestCase;

	class ArtistSearchTest extends TestCase {

		public function testGettingKnownArtist(){
			exec('php ../artist_search.php Adele', $output, $return_var);
			$json_output = json_decode($output[0],true);
			$this->assertNotEquals(0, count($output));
			$this->assertNotEquals(count($json_output['items']), 0);
			$this->assertEquals($json_output['items'][0]['name'], 'Adele');
		}

		public function testNumericalReturnsNothing(){
			exec('php ../artist_search.php 50390934580934090943095', $output, $return_var);
			$json_output = json_decode($output[0],true);
			
			$this->assertEquals(count($json_output['items']), 0);
			$this->assertEquals($json_output['total'], 0);
			$this->assertNotEquals(0, count($output));
		}

		public function testSymbolicReturnsNothing(){
			exec('php ../artist_search.php **%*%$*&**&', $output, $return_var);
			$json_output = json_decode($output[0],true);
			
			$this->assertEquals(count($json_output['items']), 0);
			$this->assertEquals($json_output['total'], 0);
			$this->assertNotEquals(0, count($output));
		}

		public function testLongInput(){
			exec('php ../artist_search.php LoremIpsumissimplydummytextoftheprintingandtypesettingindustry.LoremIpsumhasbeentheindustrysstandarddummytexteversincethe1500s,whenanunknownprintertookagalleyoftypeandscrambledittomakeatypespecimenbook.Ithassurvivednotonlyfivecenturies,butalsotheleapintoelectronictypesetting,remainingessentiallyunchanged.Itwaspopularisedinthe1960swiththereleaseofLetrasetsheetscontainingLoremIpsumpassages,andmorerecentlywithdesktoppublishingsoftwarelikeAldusPageMakerincludingversionsofLoremIpsum.LoremIpsumissimplydummytextoftheprintingandtypesettingindustry.LoremIpsumhasbeentheindustrysstandarddummytexteversincethe1500s,whenanunknownprintertookagalleyoftypeandscrambledittomakeatypespecimenbook.Ithassurvivednotonlyfivecenturies,butalsotheleapintoelectronictypesetting,remainingessentiallyunchanged.Itwaspopularisedinthe1960swiththereleaseofLetrasetsheetscontainingLoremIpsumpassages,andmorerecentlywithdesktoppublishingsoftwarelikeAldusPageMakerincludingversionsofLoremIpsum.', $output, $return_var);
			$json_output = json_decode($output[0],true);


			$this->assertEquals(count($json_output['items']), 0);
			$this->assertEquals($json_output['total'], 0);
			$this->assertNotEquals(0, count($output));
		}

		public function testMultiNameArtist(){
			exec('php ../artist_search.php Michael Jackson', $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertNotEquals(0, count($output));
			$this->assertNotEquals(count($json_output['items']), 0);
			$this->assertEquals($json_output['items'][0]['name'], 'Michael Jackson');
		}

		public function testArtistWithSymolsInName(){
			exec('php ../artist_search.php MAGIC!', $output, $return_var);
			$json_output = json_decode($output[0],true);

			$this->assertNotEquals(0, count($output));
			$this->assertNotEquals(count($json_output['items']), 0);
			$this->assertEquals($json_output['items'][0]['name'], 'MAGIC!');
		}

	

	}

?>