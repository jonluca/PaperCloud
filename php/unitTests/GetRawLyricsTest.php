<?php
	use PHPUnit\Framework\TestCase;

	class GetRawLyricsTest extends TestCase {
		public function testKnownSongAndArtist(){
			exec('php ../get_raw_lyrics.php adele hello', $output, $return_var);

			$contains_lyrics = strpos($output[1], 'Hello, it\'s me') !== false;
			$this->assertEquals(true, $contains_lyrics);
			$this->assertNotEquals('', $output);
		}

		public function testKnownArtistBadSong(){
			exec('php ../get_raw_lyrics.php adele flabbergasted', $output, $return_var);
			$this->assertEquals(0, count($output));
		}

		public function testBadArtistKnownSong(){
			exec('php ../get_raw_lyrics.php vladamirPutininski hello', $output, $return_var);
			$this->assertEquals(0, count($output));
		}

		public function testNumericSymbolicInputForArtist(){
			exec('php ../get_raw_lyrics.php %%%%$*#%*#$*%$*# flabbergasted', $output, $return_var);
			$this->assertEquals(0, count($output));
		}

		public function testNumericSymbolicInputForSong(){
			exec('php ../get_raw_lyrics.php adele %%%%$*#%*#$*%$*#', $output, $return_var);
			$this->assertEquals(0, count($output));
		}

		public function testSongWithoutLyrics(){
			exec('php ../get_raw_lyrics.php rise overwerk', $output, $return_var);
			$this->assertEquals(0, count($output));
		}

		public function testLongInput(){
			exec('php ../get_raw_lyrics.php LoremIpsumissimplydummytextoftheprintingandtypesettingindustry.LoremIpsumhasbeentheindustrysstandarddummytexteversincethe1500s,whenanunknownprintertookagalleyoftypeandscrambledittomakeatypespecimenbook.Ithassurvivednotonlyfivecenturies,butalsotheleapintoelectronictypesetting,remainingessentiallyunchanged.Itwaspopularisedinthe1960swiththereleaseofLetrasetsheetscontainingLoremIpsumpassages,andmorerecentlywithdesktoppublishingsoftwarelikeAldusPageMakerincludingversionsofLoremIpsum.LoremIpsumissimplydummytextoftheprintingandtypesettingindustry.LoremIpsumhasbeentheindustrysstandarddummytexteversincethe1500s,whenanunknownprintertookagalleyoftypeandscrambledittomakeatypespecimenbook.Ithassurvivednotonlyfivecenturies,butalsotheleapintoelectronictypesetting,remainingessentiallyunchanged.Itwaspopularisedinthe1960swiththereleaseofLetrasetsheetscontainingLoremIpsumpassages,andmorerecentlywithdesktoppublishingsoftwarelikeAldusPageMakerincludingversionsofLoremIpsum. LoremIpsumissimplydummytextoftheprintingandtypesettingindustry.LoremIpsumhasbeentheindustrysstandarddummytexteversincethe1500s,whenanunknownprintertookagalleyoftypeandscrambledittomakeatypespecimenbook.Ithassurvivednotonlyfivecenturies,butalsotheleapintoelectronictypesetting,remainingessentiallyunchanged.Itwaspopularisedinthe1960swiththereleaseofLetrasetsheetscontainingLoremIpsumpassages,andmorerecentlywithdesktoppublishingsoftwarelikeAldusPageMakerincludingversionsofLoremIpsum.LoremIpsumissimplydummytextoftheprintingandtypesettingindustry.LoremIpsumhasbeentheindustrysstandarddummytexteversincethe1500s,whenanunknownprintertookagalleyoftypeandscrambledittomakeatypespecimenbook.Ithassurvivednotonlyfivecenturies,butalsotheleapintoelectronictypesetting,remainingessentiallyunchanged.Itwaspopularisedinthe1960swiththereleaseofLetrasetsheetscontainingLoremIpsumpassages,andmorerecentlywithdesktoppublishingsoftwarelikeAldusPageMakerincludingversionsofLoremIpsum.', $output, $return_var);
			$this->assertEquals(0, count($output));
		}
	}

?>