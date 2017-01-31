var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Room 15' });
});

router.get('/request', function(req, res, next) {
	res.render('paramless', {title: "Room 15"});
});

router.get('/request/:id/', function(req, res, next) {
	var id = req.params.id;
	console.log(id);
	if(!isInt(id)) {
		res.redirect('/request');
		return;
	}
	fetch('https://api.stackexchange.com/2.2/users/' + id + '?order=desc&key=P)hq2VlKL3FWhlsiTo*Aog((&sort=reputation&site=stackoverflow&filter=!LnNkvsiMteR29sqg1h8N)5')
		.then(function(res) {
    	    return res.json();
    	}).then(function(json) {
    	    console.log(json);
    	    if(!json['error_id']) {
    	    	var rep = json['items'][0]['reputation'];
    	    	var questions = json['items'][0]['question_count'];
    	    	var answers = json['items'][0]['answer_count'];
    	    	var display_name = json['items'][0]['display_name'];
    	    	var insufficientRep = false;
    	    	var badratio = false;
    	    	var usernameRegex = /user\d.*/;
    	    	var defaultLikeUsername = usernameRegex.test(display_name);
    	    	var qaratio = -1;
    	    	var qaratios = "0:0";
    	    	if(answers > 0) {
    	    		qaratio = (questions * 1.0)/answers;
    	    		var temps = reduce(questions, answers);
    	    		qaratios = temps[0] + ":" + temps[1];
    	    		if(questions == 0) {
    	    			qaratios = questions + ":" + answers;	
    	    		}
    	    	} else {
    	    		badratio = true;
    	    		qaratios = questions + ":" + answers;
    	    	}
    	    	if (rep < 80) {
    	    		insufficientRep = true;
    	    	}
    	    	if(qaratio > 0.75 || (questions == 0 && answers == 0)) {
    	    		badratio = true;
    	    	}
    	    	res.render('request', {title: "Access Request - Room 15", badratio: badratio, rep: rep, insufficientRep: insufficientRep, qaratio: qaratio, qaratios, qaratios, display_name: display_name, defaultLikeUsername: defaultLikeUsername});
    	    } else {
    	    	res.redirect('/request');
				return;
    	    }
    	});
});

function reduce(numerator,denominator) {
  var gcd = function gcd(a,b) {
    return b ? gcd(b, a%b) : a;
  };
  gcd = gcd(numerator,denominator);
  return [numerator/gcd, denominator/gcd];
}

function isInt(value) {
  if (isNaN(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
}

module.exports = router;
