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

// describe('ProgressBarFunctionsProperly', function(){
// 	it('InitiatesWhenSearchIsClicked', function(){
// 		var before = line.value();
// 		$('#search').trigger('click');
// 		var after = line.value();
// 		expect(before).to.equal(0);
// 		expect(after).to.not.equal(0);
// 	});
// });

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
		 console.log('textResponse:', textResponse);
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
