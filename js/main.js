MathJax.Hub.Config({
	tex2jax : {
		inlineMath : [['$', '$'], ['\\[', '\\]']]
	},
	"HTML-CSS" : {
		scale : 110
	},
	TeX : {
		Macros : {
			"dC" : "{\\mathbb{C}}",
			"dN" : "{\\mathbb{N}}",
			"dR" : "{\\mathbb{R}}",
			"dZ" : "{\\mathbb{Z}}",
			"cB" : "{\\mathcal{B}}",
			"cC" : "{\\mathcal{C}}",
			"cL" : "{\\mathcal{L}}",
			"cM" : "{\\mathcal{M}}",
			"cS" : "{\\mathcal{S}}",
			"Ker" : "{\\mathop{Ker}}",
			"Im" : "{\\mathop{Im}}",
			"re" : "{\\mathfrak{Re}}",
			"im" : "{\\mathfrak{Im}}",
			"syst" : ["\\left\\{\\begin{aligned}#1\\end{aligned}\\right.", 1],
			"vect" : "{\\mathop{vect}}",
			"la" : "{\\lambda}",
			"te" : "{\\theta}",
			"trans" : ["{}^t#1", 1],
			"tr" : "{\\mathop{Tr}}",
			"O" : "{\\DeclareMathOperator{O}}",
			"rg" : "{\\DeclareMathOperator{rg}}",
			"sp" : "{\\DeclareMathOperator{sp}}",
			"iddots" : "{\\kern3mu\\raise1mu{.}\\kern3mu\\raise6mu{.}\\kern3mu\\raise12mu{.}}",
			"al" : "{\\alpha}"
		}

	}
});
MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
	var TEX = MathJax.InputJax.TeX;
	var PREFILTER = TEX.prefilterMath;
	TEX.Augment({
		prefilterMath : function(math, displaymode, script) {
			math = "\\displaystyle{" + math + "}";
			return PREFILTER.call(TEX, math, displaymode, script);
		}
	});
});

function Item($http, file) {
	var self = this;
	self.enonce = "";
	self.reponses = [];
	$http.get(file).success(function(xml) {
		self.enonce = $(xml).find("enonce").text();
		$(xml).find("reponse").each(function() {
			self.reponses.push({
				reponse : $(this).text(),
				value : $(this).attr('value') === "true",
				userValue : false
			});
		})
	})
	self.score = function() {
		var s = 0;
		for (var i in self.reponses) {
			var reponse = self.reponses[i];
			if (reponse.value === reponse.userValue) {
				s++;
			}
		}
		return s;
	};
}

function Quiz($scope, $http) {
	var self = this;
	self.fileList = ["Exercices/Exo001.xml", "Exercices/Exo002.xml", "Exercices/Exo003.xml"];
	$scope.length = self.fileList.length;
	self.itemList = [];
	for (var i in self.fileList) {
		var item = new Item($http, self.fileList[i]);
		self.itemList.push(item);
	}
	$scope.index = 0;
	$scope.item = self.itemList[$scope.index];
	$scope.previous = function() {
		$scope.index--;
		$scope.item = self.itemList[$scope.index];
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	}
	$scope.next = function() {
		$scope.index++;
		$scope.item = self.itemList[$scope.index];
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
	}
	$scope.score = function() {
		var s = 0;
		for (var i in self.itemList) {
			s += self.itemList[i].score();
		}
		return s;
	}
}
