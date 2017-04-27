var expect = chai.expect;

//example test
//go to /test.html to see the results!
describe("NameOfFunctionalityToBeTested", function(){
	it("TestName", function(){
		//make function call with input here
		var output = "hello";
		var expectedOutput = "hello";
		expect(output).to.equal(expectedOutput);
	});
});

describe("Wordcloud List", function(){
    it("getListOfPapers", function(){
        var output = getPaperListByName("hello");

        expect(output).to.exist;
        expect(output).to.be.a('array');
    });
});

describe('ProgressBarFunctionsProperly', function(){
	it('InitiatesWhenSearchIsClicked', function(){
		var before = line.value();
		$('#search').trigger('click');
		setTimeout(function(){
			var after = line.value();
			expect(before).to.equal(0);
			expect(after).to.not.equal(0);
		});
	});
});

describe("IEEE", function(){
    it("returnCorrectPdfUrl", function(){
        var output = IEEEGetPdfUrl(745444, "apparatus");
        expect(output).to.exist;
        expect(output).to.equal("php/pdfs/IEEE-745444-apparatus.pdf");
    });
				it("outputPdfText", function(){
        IEEEGetText(745444).done(function(text) {
            expect(text).to.exist;
								})
    });
});

//encountered a bug on ACM Search, from it returning not JSON
describe("ACMSearchFormatsCorrectly", function(){
	it('ReturnsJson', function(){
		ACMSearch("smith", 10).done(function(textResponse) {
		 var firstChar = textResponse.substring(0,1);
		 var jsonChar = '{';
		 var htmlErrorChar = '<';
		 expect(firstChar).to.equal(jsonChar);
		 expect(firstChar).not.to.equal(htmlErrorChar);
  });
	});
});

// describe("SearchSavesPreviousSearches". function(){
// 	it('recordsSearchParameterOnSearch', function(){
// 		var initialNumSearches = previousSearches.length;
// 		search('smith');
// 		var endNumSearches = previousSearches.length;
// 		expect(initalNumSearches).to.equal(0);
// 		expect(endNumSearches).to.equal(1);
// 		expect(endNumSearches).not.to.equal(0);
// 	});
// });
//

describe('SearchHistoryFunctionsCorrectly', function(){
	it('DoesNotDuplicateSearches', function(){
		$("#search").val("smith");
		$("#number_papers").val(10);
		search();
		var length = previousSearches.length;
		search();
		var length2 = previousSearches.length;
		console.log("Length", length);
		console.log("Length2", length2);
		expect(length).to.equal(length2);
	});
});

describe('SearchHistoryNullPopup', function(){
	it('DoesNotProduceContainerWithoutSearch', function(){
		var dropdownlength = $('.dropdown-content').length;
		expect(dropdownlength).to.equal(0);
	});
});

describe('BugResolvedForBadInputOnNumberPapers', function(){
	it('cannotAcceptBadInputFromKeyPress', function(){
		var e = jQuery.Event("keydown");
		e.which = 50; // # Some key code value
		var beforeVal = $("#number_papers").val();
		$("#number_papers").trigger(e);
		var afterVal = $("#number_papers").val();
		expect(beforeVal).to.equal(afterVal);
	});
});


describe('SearchOperatesWhenAuthorIsClicked', function(){
	it('fillsSearchBar', function(){
		$('.author').trigger('click');
		var searchVal = $('#search').val();
		var empty = '';
		expect(searchVal).not.to.equal(empty);
	});

	//after ten seconds check to see if the search performed
	it('performsSearch', function(){
		var firstList = list_of_words;
		$('.author').trigger('click');
		setTimeout(function(){
			var secondList = list_of_words;
			expect(firstList).not.to.equal(secondList);
		}, 100);
	})
});


describe('SearchHistoryIsStillClickableBug', function(){
	it("dropdownStillexistsAfterUnfocus", function(){
		$("#search").trigger('focus');
		$("#search").trigger('fucusout');
		var dropdown = $('.dropdown-content');
		expect(dropdown).not.to.equal(undefined);
	})
});

describe('GenerateWordCloudFromSubset', function(){
    it('generateWordCloudFromSubset', function(){
        var listOfPapers =  []
        var answer = getSubsetWordCloud(listOfPapers);
        expect(answer).to.be.a('string');
    });
});

describe("ProgressBarBugFixed", function(){
	it("ProgressBarIncreasesOverTimeWhile", function(){
		$('#search').trigger('click');
		setTimeout(function(){
			var before = line.value();
			setTimeout(function(){
				var after = line.value();
				expect(before).to.not.equal(after);
			}, 200);
		});
	});
});

describe("BibtexExists", function(){
	it("BibtexLinkExistsAfterPaperListCreated", function(){
		search("denham");
		setTimeout(function(){
			createPaperList();
			var bibtexVal = $('bibtex').val();
			expect(bibtexVal).not.to.equal('');
		}, 10000);
	});
});

describe("PDFDownLoadExists", function(){
	it("PDFLinkExistsAfterPaperListCreated", function(){
		search("denham");
		setTimeout(function(){
			createPaperList();
			var pdfVal = $('pdf-download').val();
			expect(pdfVal).not.to.equal('');
		}, 10000);
	});
});

describe("TextDownLoadExists", function(){
	it("TextLinkExistsAfterPaperListCreated", function(){
		search("denham");
		setTimeout(function(){
			createPaperList();
			var textDowload = $('text-download').val();
			expect(textDownload).not.to.equal('');
		}, 10000);
	});
});

describe("conferenceDownLoadExists", function(){
	it("ConferenceDownloadExistsAfterPaperListCreated", function(){
		search("denham");
		setTimeout(function(){
			createPaperList();
			var conferenceLink = $('conferenceLing').val();
			expect(conferenceLink).not.to.equal('');
		}, 10000);
	});
});