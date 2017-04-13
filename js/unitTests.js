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
