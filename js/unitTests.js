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
		var after = line.value();
		expect(before).to.equal(0);
		expect(after).to.not.equal(0);
	});
});


