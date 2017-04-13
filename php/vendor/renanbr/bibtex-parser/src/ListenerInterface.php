<?php

/*
 * This file is part of the BibTex Parser.
 *
 * (c) Renan de Lima Barbosa <renandelima@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace RenanBr\BibTexParser;

interface ListenerInterface
{
    /**
     * @param string $text The original content of the unit found.
     *                     Escape character will not be sent.
     * @param array $context Contains details of the unit found.
     */
    public function bibTexUnitFound($text, array $context);
}
