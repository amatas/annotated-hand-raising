/*
 * This file is a modified version of the old system, used for if a client does not have a Javascript-capable browser
 */

var express = require('express');
var router = express.Router();
var nano = require('nano')('http://localhost:5984');	//change to proper login
//var nodemailer = require('nodemailer');
//var mail = nodemailer.createTransport(
/*	{
		service: 'gmail',
		debug: true,
		auth: {
			user: '',
			pass: ''
		}
	}*/
//);

////////DATABASE SETUP////////
nano.db.list(function(err, body)
{
	var dbPresent = false;
	body.forEach(function(db)
	{
		if(db === 'tohru')
		{
			dbPresent = true;
		}
	});
	if(!dbPresent)	//Create TOHRU database
	{
		nano.db.create('tohru');
		var db = nano.use('tohru');
		//any 'starter' documents to be created go here
	}
});
var db = nano.use('tohru');

var pagelogin = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
<html>\
	<head>\
		<title> TOHRU </title>\
		<link rel="stylesheet" type="text/css" href="../stylesheets/tohru.css">\
	</head>\
	<body>\
		<div class="logomain">\
			<img class="logoimg" src="../images/TOHRU_Hand_crop.png" height=80>\
			<div class="logotext">\
				<div class="logotitle">\
					TOHRU - Trace Online\
				</div>\
				<div class="logobottom">\
					Hand Raising Utility\
				</div>\
			</div>\
		</div>\
\
		<h1>WELCOME TO TOHRU</h1>\
		<br/>\
		<br/>\
		<h1> To Enter a Meeting: </h1>\
		<div class="indent">\
			<form action="old/register" method="get">\
			<p>\
				Meeting ID:\
				<br/>\
				<input class="entryfield" type="text" id="meetingfield" name="meeting">\
			</p>\
			<p>\
				Your Name (plus affiliation):\
				<br/>\
				<input class="entryfield" type="text" id="namefield" name="name">\
				<input type="hidden" name="ID" value="XXXXRANDOMIDXXXX">\
			</p>\
			<p>\
				<input type="submit" value="Enter as Participant">\
			</p>\
			</form>\
			<br/>\
			<br/>\
			<p>\
				TOHRU is a hand-raising utility created by the Trace Center (U of Wisconsin) and hosted by the Raising the Floor Consortium. It is free to use but contributions are welcome. Versions that can operate behind firewalls are available.\
			</p>\
		</div>\
	</body>\
</html>';

var pagemeeting = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
<html>\
	<head>\
		<title> TOHRU </title>\
		<meta http-equiv="refresh" content="10" />\
		<link rel="stylesheet" type="text/css" href="../stylesheets/tohru.css">\
	</head>\
	<body>\
		<div class="logomain">\
			<img class="logoimg" src="../images/TOHRU_Hand_crop.png" height=80px>\
			<div class="logotext">\
				<div class="logotitle">\
					TOHRU - Trace Online\
				</div>\
				<div class="logobottom">\
					Hand Raising Utility\
				</div>\
			</div>\
		</div>\
		<div id="controls" class="controlbox">\
			<p>\
				Please add me to the queue to speak about:\
			</p>\
			<p>\
				<form action="/oldlistaction/raises" method="post">\
					<input type="hidden" name="htype" value="S">\
					<input type="hidden" name="meeting" value="XXXXMEETINGXXXX">\
					<input type="hidden" name="name" value="XXXXUSERNAMEXXXX">\
					<input type="hidden" name="ID" value="XXXXUSERIDXXXX">\
					<input type="hidden" name="url" value="XXXXTHISURLXXXX">\
				<button class="commentbutton" type="submit"><img src="../images/S_Icon.png" height=20 style="vertical-align:middle">\
					ame Topic\
				</button>\
				</form>\
			</p>\
			<p>\
				<form action="/oldlistaction/raises" method="post">\
					<input type="hidden" name="htype" value="N">\
					<input type="hidden" name="meeting" value="XXXXMEETINGXXXX">\
					<input type="hidden" name="name" value="XXXXUSERNAMEXXXX">\
					<input type="hidden" name="ID" value="XXXXUSERIDXXXX">\
					<input type="hidden" name="url" value="XXXXTHISURLXXXX">\
				<button class="commentbutton" type="submit"><img src="../images/N_Icon.png" height=20 style="vertical-align:middle">\
					ew Topic\
				</button>\
			</form>\
			</p>\
			<p>\
				<form action="/oldlistaction/raises" method="post">\
					<input type="hidden" name="htype" value="A">\
					<input type="hidden" name="meeting" value="XXXXMEETINGXXXX">\
					<input type="hidden" name="name" value="XXXXUSERNAMEXXXX">\
					<input type="hidden" name="ID" value="XXXXUSERIDXXXX">\
					<input type="hidden" name="url" value="XXXXTHISURLXXXX">\
				<button class="commentbutton" type="submit"><img src="../images/A_Icon.png" height=20 style="vertical-align:middle">\
					nswer to Question\
				</button>\
				that was asked by speaker\
				</form>\
			</p>\
			<p>\
				<form action="/oldlistaction/raises" method="post">\
					<input type="hidden" name="htype" value="P">\
					<input type="hidden" name="meeting" value="XXXXMEETINGXXXX">\
					<input type="hidden" name="name" value="XXXXUSERNAMEXXXX">\
					<input type="hidden" name="ID" value="XXXXUSERIDXXXX">\
					<input type="hidden" name="url" value="XXXXTHISURLXXXX">\
					<button class="commentbutton" type="submit"><img src="../images/P_Icon.png" height=20 style="vertical-align:middle">\
						ropose Resolution\
					</button>\
					addressing all issues\
				</form>\
			</p>\
			<div id="downbutton">\
				XXXXDOWNBUTTONXXXX\
			</div>\
		</div>\
		<br/>\
		<p>\
			<div class="speakerbox">\
				<h3>Currently Speaking:</h3>\
				<div id="speaker">\
					XXXXCURRENTSPEAKERXXXX\
				</div>\
			</div>\
		</p>\
		<div id="theList">\
			XXXXTHELISTXXXX\
		</div>\
	</body>\
</html>';

var downbutton = '<form action="/oldlistaction/lowers" method="post">\
					<input type="hidden" name="meeting" value="XXXXMEETINGXXXX">\
					<input type="hidden" name="name" value="XXXXUSERNAMEXXXX">\
					<input type="hidden" name="ID" value="XXXXUSERIDXXXX">\
					<input type="hidden" name="url" value="XXXXTHISURLXXXX">\
					<button type="submit">Lower Hand</button>\
				</form>';

var pagewhoops = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
<html>\
	<head>\
		<title> TOHRU </title>\
	</head>\
	<body>\
		<p>XXXXERRORMESSAGEXXXX</p>\
		<form action="/old" method="get">\
			<button type="submit">OK</button>\
		</form>\
	</body>\
</html>';

var pageproceed = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
<html>\
	<head>\
		<title> TOHRU </title>\
	</head>\
	<body>\
		<p>Successfully registered in meeting XXXXMEETINGXXXX</p>\
		<form action="/old/meeting" method="get">\
			<input type="hidden" name="name" value="XXXXUSERNAMEXXXX">\
			<input type="hidden" name="ID" value="XXXXUSERIDXXXX">\
			<input type="hidden" name="meeting" value="XXXXMEETINGXXXX">\
			<button type="submit">Proceed</button>\
		</form>\
	</body>\
</html>';

var pageupdatefail = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
<html>\
	<head>\
		<title> TOHRU </title>\
		<meta http-equiv="refresh" content="1" />\
	</head>\
	<body>\
		<p>Data retrieval error, please wait</p>\
	</body>\
</html>';

router.get('/', function(req, res)
{
	var page = pagelogin;
	var randID = Math.floor((Math.random()*1000000)+1);
	page = page.replace(/XXXXRANDOMIDXXXX/g, randID);
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(page);
	res.end();
});

/**
 * Recursively inserts a username into a registry.
 */
function insertUser(mname, user)
{
	db.get('##REGISTRY##'+mname, function(err, body)
	{
		if(!err)
		{
			body.users.push(user);
			db.insert(body, function(err, body)
			{
				if(err)
				{
					insertUser(mname, user);
				}
			});
		}
	});
}

router.get('/register', function(req, res)
{
	if(req.query.name != '')
	{
		if(req.query.meeting != '')
		{
			db.get('##REGISTRY##'+req.query.meeting, function(err, body)
			{
				if(err)
				{
					var page = pagewhoops;
					page = page.replace(/XXXXERRORMESSAGEXXXX/g, "ERROR: Meeting not found.");
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(page);
					res.end();
				}
				else
				{
					var found = false;
					if(body.users.length > 0)
					{
						for(i = 0; i < body.users.length; i++)
						{
							if(body.users[i].name == req.query.name && body.users[i].ID == req.query.ID) found = true;
						}
					}
					if(!found)
						{
						var user = {
							name: req.query.name,
							ID: req.query.ID,
							date: Date.now(),
							isMod: false
						};
						insertUser(req.query.meeting, user);
					}
					var page = pageproceed;
					page = page.replace(/XXXXUSERNAMEXXXX/g, req.query.name);
					page = page.replace(/XXXXUSERIDXXXX/g, req.query.ID);
					page = page.replace(/XXXXMEETINGXXXX/g, req.query.meeting);
					res.writeHead(200, {'Content-Type': 'text/html'});
					res.write(page);
					res.end();
				}
			});
		}
		else
		{
			var page = pagewhoops;
			page = page.replace(/XXXXERRORMESSAGEXXXX/g, "ERROR: You must input a meeting name.");
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(page);
			res.end();
		}
	}
	else
	{
		var page = pagewhoops;
		page = page.replace(/XXXXERRORMESSAGEXXXX/g, "ERROR: You must input a username.");
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(page);
		res.end();
	}
});

router.get('/meeting', function(req, res)
{
	db.get('##HANDS##'+req.query.meeting, function(err, data)
	{
		if(err)
		{
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(pageupdatefail);
			res.end();
		}
		else
		{
			var page = pagemeeting;
			if(data.hands.length == 0)
			{
				page = page.replace(/XXXXDOWNBUTTONXXXX/g, '');
				page = page.replace(/XXXXCURRENTSPEAKERXXXX/g, 'NO HANDS RAISED');
				page = page.replace(/XXXXTHELISTXXXX/g, '');
			}
			else
			{
				if(data.hands[0].type != 'X')
				{
					var spkr = data.hands[0].name;
					if(data.hands[0].comment != '') spkr = spkr + ' [' + data.hands[0].comment + ']';
					page = page.replace(/XXXXCURRENTSPEAKERXXXX/g, spkr);
				}
				else
				{
					page = page.replace(/XXXXCURRENTSPEAKERXXXX/g, 'PEOPLE IN QUEUE');
				}
				var first = true;
				data.hands.forEach(function(hand)
				{
					if(first) first = false;
					else
					{
						if(hand.type != 'X')
						{
							var isMine = hand.name==req.query.name&&hand.ID==req.query.ID;
							var entry = '<p class="handlisting" id=' + hand.ID + '>';
							entry += '<img src="../images/' + hand.type + '_Icon.png" height=20 style="vertical-align:middle">';
							if(isMine) entry += '<span style="color: blue">';
							entry += '<span style="font-weight: bold">';
							entry += '&nbsp &nbsp';
							entry += hand.name;
							entry += '</span>  ';
							if(hand.comment != '') entry += '['+hand.comment+']';
							if(isMine) entry += '</span>';
							entry += '</p>';
							entry += 'XXXXTHELISTXXXX';
							page = page.replace(/XXXXTHELISTXXXX/g, entry);
							if(isMine) page = page.replace(/XXXXDOWNBUTTONXXXX/g, downbutton);
						}
					}
				});
				page = page.replace(/XXXXTHELISTXXXX/g, '');
				page = page.replace(/XXXXDOWNBUTTONXXXX/g, '');
			}
			var thisurl = req.protocol + '://' + req.get('host') + req.originalUrl;
			page = page.replace(/XXXXTHISURLXXXX/g, thisurl);
			page = page.replace(/XXXXUSERNAMEXXXX/g, req.query.name);
			page = page.replace(/XXXXUSERIDXXXX/g, req.query.ID);
			page = page.replace(/XXXXMEETINGXXXX/g, req.query.meeting);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(page);
			res.end();
		}
	});
});

router.post('/raises', function(req, res)
{
	res.redirect(req.body.url);
});

router.post('/lowers', function(req, res)
{
	res.redirect(req.body.url);
});

router.post('/test', function(req, res)
{
	console.log(req.body.alpha);
});

/**
 * Simply check if a document exists for a particular meeting
 */
router.post('/meetexists', function(req, res)
{
	db.get(req.body.meeting, function(err, body)
	{
		if(err)
		{
			res.json({exists:false});
		}
		else
		{
			res.json({exists:true});
		}
	});
});

/**
 * Function for checking validity of a password
 */
/*
var modPassCheck = function(meeting, modpass, cb)
{
	db.get('##MODPASS##'+meeting, function(err, body)
	{
		if(err)
		{
			cb(false);
		}
		else
		{
			if(modpass == body.password)
			{
				cb(true);
			}
			else
			{
				cb(false);
			}
		}
	});
};
*/

/**
 * Recursive function for registration
 */
updateRegister = function(db, meeting, username)
{
	db.get(meeting, function(err, body)
	{
		body.users.push({name: username});
		body.update = Date.now();
		db.insert(body, function(err, body)
		{
			if(err)
			{
				updateRegister(db, meeting, username);
			}
		});
	});
};

/**
 * Registers a new user in a meeting and gives them the meeting key.
 */
router.post('/registers', function(req, res)
{
	db.get(req.body.meeting, function(err, body)
	{
		if(err)
		{
			console.log('User "'+req.body.name+'" could not find meeting "'+req.body.meeting+'"');
			res.json({key:-52});
		}
		else
		{
			updateRegister(db, req.body.meeting, req.body.name);
			console.log('User "'+req.body.name+'" registered in meeting "'+req.body.meeting+'"');
			res.json({key: body.key});
		}
	});
});

/**
 * Raises user's hand
 */
handRaise = function(req, res)
{
	db.get(req.body.meeting, function(err, body)
	{
		if(err)
		{
			res.json({success:false});
		}
		else
		{
			var found = false;
			if(body.hands.length > 0)
			{
			for(i = 0; i < body.hands.length; i++)
			{
				if(body.hands[i].name == req.body.name && body.hands[i].ID == req.body.ID)
				{
					body.hands[i].type = req.body.hand.type;
					body.hands[i].comment = req.body.hand.comment;
					found = true;
				}
			}
			}
			if(!found)
			{
				body.hands.push({
					name: req.body.name,
					ID: req.body.ID,
					type: req.body.hand.type,
					comment: req.body.hand.comment
				});
			}
			body.update = Date.now();
			db.insert(body, function(err, body)
			{
				if(err)
				{
					handRaise(req, res);
				}
				else
				{
					console.log('User "'+req.body.name+'" raised his hand');
					res.json({success:true});
				}
			});
		}
	});
};
router.post('/raise', function(req, res){handRaise(req, res);});

/**
 * Lowers user's hand
 */
handLower = function(req, res)
{
	db.get(req.body.meeting, function(err, body)
	{
		if(err)
		{
			res.json({success:false});
		}
		else
		{
			for(i = 0; i < body.hands.length; i++)
			{
				if(body.hands[i].name == req.body.name && body.hands[i].ID == req.body.ID)
				{
					body.hands.splice(i, 1);
				}
			}
			body.update = Date.now();
			db.insert(body, function(err, body)
			{
				if(err)
				{
					handLower(req, res);
				}
				else
				{
					console.log('User "'+req.body.name+'" lowered his hand');
					res.json({success:true});
				}
			});
		}
	});
};
router.post('/lower', function(req, res){handLower(req, res);});

/*
totop = function(req, res)
{
	db.get(req.body.meeting, function(err, body)
	{
		if(err)
		{
			res.json({});
		}
		else
		{
			var hand = {
				name: '',
				ID: '',
				type: '',
				comment: ''
			};
			body.hands.shift();
			for(i = 0; i < body.hands.length; i++)
			{
				if(body.hands[i].name == req.body.name && body.hands[i].ID == req.body.ID)
				{
					hand.name = body.hands[i].name;
					hand.ID = body.hands[i].ID;
					hand.type = body.hands[i].type;
					hand.comment = body.hands[i].comment;
					body.hands.splice(i, 1);
				}
			}
			body.hands.unshift(hand);
			body.update = Date.now();
			db.insert(body, function(err, body)
			{
				if(err)
				{
					totop(req, res);
				}
				else
				{
					console.log('User "'+req.body.name+'" was made speaker by mod');
					res.json({success:true});
				}
			});
		}
	});
};
router.post('/totop', function(req, res){totop(req, res);});
*/
/*
advance = function(req, res)
{
	db.get(req.body.meeting, function(err, body)
	{
		if(err)
		{
			res.json({});
		}
		else
		{
			body.hands.shift();
			body.update = Date.now();
			db.insert(body, function(err, body)
			{
				if(err)
				{
					advance(req, res);
				}
				else
				{
					console.log('Queue advanced by mod');
					res.json({success:true});
				}
			});
		}
	});
};
router.post('/advance', function(req, res){advance(req, res);});
*/
/*
modnext = function(req, res)
{
	db.get(req.body.meeting, function(err, body)
	{
		if(err)
		{
			res.json({});
		}
		else
		{
			var hand = {
				name: req.body.name,
				ID: req.body.ID,
				type: req.body.hand.type,
				comment: req.body.hand.comment
			};
			//body.hands.shift();
			body.update = Date.now();
			body.hands.unshift(hand);
			db.insert(body, function(err, body)
			{
				if(err)
				{
					modnext(req, res);
				}
				else
				{
					console.log('Moderator moved to current speaker');
					res.json({success: true});
				}
			});
		}
	});
};
router.post('/modnext', function(req, res){modnext(req, res);});
*/
/*
changeMOTD = function(req, res)
{
	db.get(req.body.meeting, function(err, body)
	{
		if(err)
		{
			res.json({});
		}
		else
		{
			body.update = Date.now();
			body.MOTD = req.body.hand.comment;
			db.insert(body, function(err, body)
			{
				if(err)
				{
					changeMOTD(req, res);
				}
				else
				{
					console.log('Moderator changed MOTD to '+req.body.hand.comment);
					res.json({success: true});
				}
			});
		}
	});
};
router.post('/changeMOTD', function(req, res){changeMOTD(req, res);});
*/
/**
 * Fetches meeting data if the key matches
 */
router.get('/fetch', function(req, res)
{
	db.get(req.query.meeting, function(err, body)
	{
		if(err)
		{
			res.json({key: ''});
		}
		else
		{
			if(body.key == req.query.key)
			{
				res.json(body);
			}
			else
			{
				res.json({key: ''});
			}
		}
	});
});





/*
var http = require('http').Server(express);
var io = require('socket.io')(http);

io.on('connection', function(socket)
{
	console.log('USER CONNECTED');
	socket.on('disconnect', function()
	{
		console.log('USER DISCONNECTED');
	});
	socket.on('chat message', function(msg)
	{
		console.log('message: ' + msg);
		if(msg == 'D')
		{
			io.emit('beep');
		}
	});
});*/ 	

/*http.listen(3286, function()
{
	console.log('SOCKET LISTENING ON PORT 3286');
});*/

module.exports = router;
