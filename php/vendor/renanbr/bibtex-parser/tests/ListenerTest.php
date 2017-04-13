<?php

/*
 * This file is part of the BibTex Parser.
 *
 * (c) Renan de Lima Barbosa <renandelima@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace RenanBr\BibTexParser\Test;

use RenanBr\BibTexParser\Parser;
use RenanBr\BibTexParser\Listener;

class ListenerTest extends \PHPUnit_Framework_TestCase
{
    public function testBasic()
    {
        $listener = new Listener;

        $parser = new Parser;
        $parser->addListener($listener);
        $parser->parseFile(__DIR__ . '/resources/basic.bib');

        $entries = $listener->export();
        $this->assertCount(1, $entries);

        $entry = $entries[0];
        $this->assertSame('basic', $entry['type']);
        $this->assertSame('bar', $entry['foo']);
    }

    public function testNullableKey()
    {
        $listener = new Listener;

        $parser = new Parser;
        $parser->addListener($listener);
        $parser->parseFile(__DIR__ . '/resources/no-value.bib');

        $entries = $listener->export();
        $this->assertCount(1, $entries);

        $entry = $entries[0];
        $this->assertSame('noValue', $entry['type']);
        $this->assertSame('foo', $entry['citation-key']);
        $this->assertNull($entry['bar']);
    }

    public function testValueReading()
    {
        $listener = new Listener;

        $parser = new Parser;
        $parser->addListener($listener);
        $parser->parseFile(__DIR__ . '/resources/values-basic.bib');

        $entries = $listener->export();
        $this->assertCount(1, $entries);

        $entry = $entries[0];
        $this->assertSame('valuesBasic', $entry['type']);
        $this->assertSame('kNull', $entry['citation-key']);
        $this->assertNull($entry['kStillNull']);
        $this->assertSame('raw', $entry['kRaw']);
        $this->assertSame(' braced value ', $entry['kBraced']);
        $this->assertSame('', $entry['kBracedEmpty']);
        $this->assertSame(' quoted value ', $entry['kQuoted']);
        $this->assertSame('', $entry['kQuotedEmpty']);
    }

    public function testValueConcatenation()
    {
        $listener = new Listener;

        $parser = new Parser;
        $parser->addListener($listener);
        $parser->parseFile(__DIR__ . '/resources/values-multiple.bib');

        $entries = $listener->export();
        $this->assertCount(1, $entries);

        $entry = $entries[0];
        $this->assertSame('multipleValues', $entry['type']);
        $this->assertSame('rawArawB', $entry['raw']);
        $this->assertSame('quoted aquoted b', $entry['quoted']);
        $this->assertSame('braced abraced b', $entry['braced']);
        $this->assertSame('quotedbracedraw', $entry['misc']);
        $this->assertSame('rawquotedbraced', $entry['noSpace']);
    }

    public function testAbbreviation()
    {
        $listener = new Listener;

        $parser = new Parser;
        $parser->addListener($listener);
        $parser->parseFile(__DIR__ . '/resources/abbreviation.bib');

        $entries = $listener->export();
        $this->assertCount(3, $entries);

        $entry = $entries[0];
        $this->assertSame('string', $entry['type']);
        $this->assertSame('Renan', $entry['me']);
        $this->assertSame('', $entry['emptyAbbr']);
        $this->assertNull($entry['nullAbbr']);
        $this->assertSame('Sir Renan', $entry['meImportant']);

        $entry = $entries[1];
        $this->assertSame('string', $entry['type']);
        $this->assertSame('Glamorous Sir Renan', $entry['meAccordingToMyMother']);

        $entry = $entries[2];
        $this->assertSame('abbreviation', $entry['type']);
        $this->assertSame('Hello Glamorous Sir Renan!', $entry['message']);
        $this->assertSame('me', $entry['skip']);
        $this->assertSame('', $entry['mustEmpty']);
        $this->assertNull($entry['mustNull']);
    }

    public function testTypeOverriding()
    {
        $listener = new Listener;

        $parser = new Parser;
        $parser->addListener($listener);
        $parser->parseFile(__DIR__ . '/resources/type-overriding.bib');

        $entries = $listener->export();
        $this->assertCount(1, $entries);

        $entry = $entries[0];
        $this->assertSame('new type value', $entry['type']);
        $this->assertSame('bar', $entry['foo']);
    }

    public function testCitationKey()
    {
        $listener = new Listener;

        $parser = new Parser;
        $parser->addListener($listener);
        $parser->parseFile(__DIR__ . '/resources/citation-key.bib');

        $entries = $listener->export();
        $this->assertCount(1, $entries);

        $entry = $entries[0];
        $this->assertSame('citationKey', $entry['type']);
        $this->assertSame('Someone2016', $entry['citation-key']);
        $this->assertSame('bar', $entry['foo']);
    }

    public function testTagNameCase()
    {
        $listenerStandard = new Listener;

        $listenerUpper = new Listener;
        $listenerUpper->setTagNameCase(\CASE_UPPER);

        $listenerLower = new Listener;
        $listenerLower->setTagNameCase(\CASE_LOWER);

        $parser = new Parser;
        $parser->addListener($listenerStandard);
        $parser->addListener($listenerUpper);
        $parser->addListener($listenerLower);
        $parser->parseFile(__DIR__ . '/resources/tag-name-uppercased.bib');

        $entries = $listenerStandard->export();
        $this->assertCount(1, $entries);
        $entry = $entries[0];
        $this->assertSame('tagNameUppercased', $entry['type']);
        $this->assertSame('bAr', $entry['FoO']);

        $entries = $listenerUpper->export();
        $this->assertCount(1, $entries);
        $entry = $entries[0];
        $this->assertSame('tagNameUppercased', $entry['TYPE']);
        $this->assertSame('bAr', $entry['FOO']);

        $entries = $listenerLower->export();
        $this->assertCount(1, $entries);
        $entry = $entries[0];
        $this->assertSame('tagNameUppercased', $entry['type']);
        $this->assertSame('bAr', $entry['foo']);
    }

    public function testTagValueProcessor()
    {
        $listener = new Listener;
        $listener->setTagValueProcessor(function (&$text, $tag) {
            $text = "processed-$tag-$text";
        });

        $parser = new Parser;
        $parser->addListener($listener);
        $parser->parseFile(__DIR__ . '/resources/basic.bib');

        $entries = $listener->export();
        $entry = $entries[0];
        $this->assertSame('processed-type-basic', $entry['type']);
        $this->assertSame('processed-foo-bar', $entry['foo']);
    }
}
