var restify = require('restify');
var builder = require('botbuilder');
var fs = require('fs');
var connector = new builder.ChatConnector({
    appId: process.env.appid,
    appPassword: process.env.appkey
});
var request = require('request');
const imgurUploader = require('imgur-uploader');
var bot = new builder.UniversalBot(connector);
var nsfw = JSON.parse(fs.readFileSync("./nsfw.json", "utf8"));
const Pixiv = require('pixiv.js');
const pixiv = new Pixiv(process.env.pixiv_username, process.env.pixiv_password);
const pixivImg = require('pixiv-img');
var yoda_said = [
  '"Fear is the path to the dark side. Fear leads to anger, anger leads to hate, hate leads to suffering." -- Yoda \n',
  '"Confer on you, the level of Jedi Knight, the Council does. But, agree with your taking this boy as your Padawan Learner, I do not." -- Yoda to Obi-Wan Kenobi\n',
  '"Qui-Gon\'s defiance I sense in you. Need that you do not. Agree with you, the Council does. Your apprentice young Skywalker will be." -- Yoda to Obi-Wan Kenobi\n',
  '"Lost a planet, Master Obi-Wan has. How embarrassing, how embarrassing." -- Yoda\n',
  '"Go to the center of the gravity\'s pull, and find your planet you will." -- Yoda to Obi-Wan\n',
  '"Meditate on this, I will." -- Yoda\n',
  '"Clear, your mind must be if you are to discover the real villains behind the plot." -- Yoda to Obi-Wan\n',
  '"Pain. Suffering. Death, I feel. Something terrible has happened. Young Skywalker is in pain. Terrible pain." -- Yoda\n',
  '"Around the survivors, a perimeter create!" -- Yoda\n',
  '"Powerful you have become, Dooku. The dark side I sense in you." -- Yoda to Dooku\n',
  '"Master Obi-Wan, not victory. The shroud of the dark side has fallen. Begun, the Clone War has!" -- Yoda\n',
  '"Much to learn, you still have." -- Yoda to Dooku\n',
  '"Like fire across the galaxy, the Clone Wars spread. In league with the wicked Count Dooku more and more planets slip. Upon the Jedi Knights falls the duty to lead the newly formed Army of the Republic." -- Yoda\n',
  '"Death is a natural part of life. Rejoice for those who transform into the Force. Mourn them do not. Miss them do not. Attachment leads to jealousy. The shadow of greed, that is." -- Yoda\n',
  '"Careful you must be when sensing the future, Anakin. The fear of loss is a path to the dark side." -- Yoda to Anakin Skywalker\n',
  '"Train yourself to let go of everything you fear to lose." -- Yoda to Anakin Skywalker\n',
  '"Go, I will. Good relations with the Wookiees, I have." -- Yoda\n',
  '"Too much under the sway of the Chancellor, he is. Much anger there is in him. Too much pride in his powers." -- Yoda\n',
  '"If a special session of Congress there is, easier for us to enter the Jedi Temple it will be." -- Yoda\n',
  '"If into the security recordings you go, only pain will you find." -- Yoda to Obi-Wan Kenobi\n',
  '"Destroy the Sith, we must." -- Yoda\n',
  '"To fight this Lord Sidious, strong enough, you are not." -- Yoda to Obi-Wan Kenobi\n',
  '"Twisted by the dark side, young Skywalker has become." -- Yoda to Obi-Wan Kenobi\n',
  '"The boy you trained, gone he is, consumed by Darth Vader." -- Yoda to Obi-Wan Kenobi\n',
  '"I hear a new apprentice you have, Emperor. Or should I call you Darth Sidious?" -- Yoda to Palpatine\n',
  '"At an end your rule is, and not short enough it was." -- Yoda to Palpatine\n',
  '"Not if anything to say about it, I have!" -- Yoda\n',
  '"Into exile I must go. Failed, I have." -- Yoda to Bail Organa\n',
  '"If so powerful you are, why leave?" -- Yoda\n',
  '"Faith in your new apprentice, misplaced may be. As is your faith in the dark side of the Force." -- Yoda\n',
  'Luke: "I feel like". Yoda: "Feel like what?" -- Luke Skywalker and Yoda\n',
  '"Looking? Found someone you have I would say, mm?" -- Yoda\n',
  '"Help you I can! Yes! Mm!" -- Yoda to Luke\n',
  '"Awww, cannot get your ship out, heh-heheheh!" -- Yoda to Luke\n',
  '"How you get so big, eating food of this kind?" -- Yoda to Luke\n',
  '"Mine! Or I will help you not!" -- Yoda to Luke\n',
  '"Mudhole? Slimy? My home this is!" -- Yoda to Luke\n',
  '"Mine! Mine! Mine! MINE!!!" -- Yoda to R2-D2\n',
  '"No, no no, stay and help you I will! Hehe! Find your friend, mm?" -- Yoda to Luke\n',
  '"Ohhh, Jedi Master! Yoda. You seek Yoda!" -- Yoda to Luke\n',
  '"No! Try not. Do, or do not. There is no try." -- Yoda to Luke\n',
  'Luke: "I\'m looking for a great warrior." Yoda: "Wars not make one great." -- Luke Skywalker and Yoda\n',
  '"Ready are you? What know you of ready? For eight hundred years have I trained Jedi. My own counsel will I keep on who is to be trained! A Jedi must have the deepest commitment, the most serious mind. This one a long time have I watched. All his life has he looked away, to the future, to the horizon. Never his mind on where he was. Hmm? What he was doing. Hmph. Adventure. Heh. Excitement. Heh. A Jedi craves not these things. You are reckless!" -- Yoda\n',
  'Yoda: "I cannot teach him. The boy has no patience." Obi-Wan: "He will learn patience." Yoda: "Hmm. Much anger in him, like his father." Obi-Wan: "Was I any different, when you taught me?" -- Yoda and Obi-Wan Kenobi\n',
  'Luke: "I won\'t fail you. I\'m not afraid." Yoda: "You will be. You will be." -- Luke Skywalker and Yoda\n',
  '"Yes. A Jedi\'s strength flows from the Force. But beware the dark side. Anger, fear, aggression. The dark side of the Force are they. Easily they flow, quick to join you in a fight. If once you start down the dark path, forever will it dominate your destiny. Consume you it will, as it did Obi-Wan\'s apprentice." -- Yoda to Luke\n',
  'Luke: "Vader, Is the dark side stronger?"; Yoda: "No, no, no. Quicker, easier, more seductive.";Luke: "But how am I to know the good side from the bad?";Yoda: "You will know, when you are calm, at peace, passive. A Jedi uses the Force for knowledge and defense, never for attack." -- Yoda to Luke\n',
  '"So certain are you. Always with you it cannot be done. Hear you nothing that I say?" -- Yoda to Luke\n',
  '"No! No different! Only different in your mind. You must unlearn what you have learned." -- Yoda to Luke\n',
  'Luke: "I don\'t believe it"; Yoda: "That is why you fail." -- Yoda to Luke\n',
  '"No! Try not. Do. Or do not. There is no try." -- Yoda to Luke , \n',
  '"Size matters not. Look at me. Judge me by my size do you?" -- Yoda to Luke\n',
  '"And well you should not! For my ally is the Force. And a powerful ally it is. Life creates it, makes it grow. Its energy surrounds us, and binds us. Luminous beings are we, not this, [nudging Luke\'s arm] crude matter! You must feel the Force around you. Here, between you, me, the tree, the rock, everywhere! Even between the land and the ship." -- Yoda to Luke\n',
  '"Through the Force, things you will see. Other places. The future, the past, old friends long gone." -- Yoda to Luke\n',
  '"Hmm. Control, control. You must learn control." -- Yoda to Luke\n',
  '"Difficult to see. Always in motion is the future." -- Yoda to Luke\n',
  '"Decide you must how to serve them best. If you leave now, help them you could. But you would destroy all for which they have fought and suffered." -- Yoda to Luke\n',
  '"Strong is Vader. Mind what you have learned. Save you it can!" -- Yoda to Luke\n',
  '"No. There is another." -- Yoda to Obi-Wan\n',
  '"When nine hundred years old you reach, look as good, you will not, hm?" -- Yoda to Luke Skywalker\n',
  '"Strong am I with the Force, but not that strong. Twilight is upon me, and soon night must fall. That is the way of things, the way of the Force." -- Yoda to Luke Skywalker\n',
  '"No more training do you require. Already know you that which you need." -- Yoda to Luke Skywalker\n',
  '"No. Unfortunate that you rushed to face him, that incomplete was your training. Not ready for the burden were you." -- Yoda to Luke Skywalker\n',
  '"Remember, a Jedi\'s strength flows from the Force. But beware. Anger, fear, aggression. The dark side are they. Once you start down the dark path, forever will it dominate your destiny." -- Yoda to Luke Skywalker\n',
  '"Your father he is." -- Yoda to Luke Skywalker\n',
  '"Luke, Luke, Do not, Do not underestimate the powers of the Emperor, or suffer your father\'s fate, you will." -- Yoda to Luke Skywalker\n',
  '"Luke, when gone am I, the last of the Jedi will you be." -- Yoda to Luke Skywalker\n',
  '"Luke, there is another, Skywalker." -- Yoda to Luke Skywalker\n',
  '"Pity your new disciple I do; so lately an apprentice, so soon without a Master." -- Yoda\n',
  '"War does not make one great." -- Yoda\n',
  '"Proud I am, to stand by Wookiees in their hour of need." -- Yoda\n',
  '"Yoda I am, fight I will." -- Yoda\n',
  '"Tired I am, rest I must." -- Yoda\n',
  '"When all choices seem wrong, choose restraint." -- recalled by Mace Windu\n',
  '"If no mistake have you made, yet losing you are, a different game you should play." -- recalled by Mace Windu\n',
  '"A trial of being old is this: remembering which thing one has said into which young ears." -- Yoda\n',
  'Yoda: "Think you I have never felt the touch of the dark? Know you what a soul so great as Yoda can make, in eight hundred years?"; Dooku: "Master?"; Yoda: "Many mistakes!" -- Yoda and Dooku\n',
  '"Think you the relationship between Master and Padawan is only to help them? Oh, this is what we let them believe, yes! But when the day comes that even old Yoda does not learn something from his students-then truly, he shall be a teacher no more." -- Yoda\n',
  '"On many long journeys have I gone. And waited, too, for others to return from journeys of their own. Some return; some are broken; some come back so different only their names remain." -- Yoda\n',
  '"When you fall, apprentice, catch you I will." -- Yoda to Dooku\n',
  '"Secret, shall I tell you? Grand Master of Jedi Order am I. Won this job in a raffle I did, think you? "How did you know, how did you know, Master Yoda?" Master Yoda knows these things. His job it is." -- Master Yoda to Scout\n',
  '"Honor life by living, Padawan. Killing honors only death: only the dark side." -- Yoda\n',
  '"To be Jedi is to face the truth, and choose. Give off light, or darkness, Padawan. Be a candle, or the night, Padawan: but choose!" -- Yoda to Whie Malreaux\n',
  '"When you look at the dark side, careful you must be , for the dark side looks back." -- Yoda\n',
  '"You think Yoda stops teaching, just because his student does not want to hear? Yoda a teacher is. Yoda teaches like drunkards drink. Like killers kill." -- Yoda\n',
  '"Humility endless is." -- Yoda\n',
  '"A labyrinth of evil, this war has become." -- Yoda\n',
  '"Sworn by oath to uphold you, we are." -- Yoda to Palpatine\n',
  '"From the dark path, no returning there is. Forever, the direction of your life it dominates." -- Yoda\n',
  '"To the Force, look for guidance. Accept what fate has placed before us." -- Yoda\n',
  '"Yoda, you seek?" -- Yoda\n', '"My ally is the Force" -- Yoda\n'
];

// Menus
bot.beginDialogAction("menu", "/menu", { matches: "menu"});
bot.beginDialogAction("menu", "/menu", { matches: /\/start/g});
bot.dialog('/menu', function (session) {
	if (session.message.source === "groupme" || session.message.source === "skypeforbusiness") {			session.endDialog("Keyboard Mode is not available on GroupMe / Skype for Business. Please use only commands.\nFor more information, type \"help\".");
}
	else {
		var msg = new builder.Message(session);
		msg.attachmentLayout(builder.AttachmentLayout.carousel)
		msg.attachments([
			new builder.HeroCard(session)
			.title("What would you like to do right now?")
			.subtitle("Select one of the following categories.")
			.buttons([
				builder.CardAction.imBack(session, "Images", "Images"),
				builder.CardAction.imBack(session, "Utility", "Utility"),
				builder.CardAction.imBack(session, "Fun", "Fun"),
				builder.CardAction.imBack(session, "About/Support", "About/Support"),
			])
		]);
		session.endDialog(msg);
	}
});

bot.beginDialogAction("image", "/image", { matches: /Image/g});
bot.dialog('/image', [
	function (session) {
		if (session.message.source === "groupme" || session.message.source === "skypeforbusiness") {			session.endDialog("Keyboard Mode is not available on GroupMe / Skype for Business. Please use only commands.\nFor more information, type \"help\".");
}
		else {
			var msg = new builder.Message(session);
			msg.attachmentLayout(builder.AttachmentLayout.carousel)
			msg.attachments([
				new builder.HeroCard(session)
				.title("What would you like to do right now?")
				.subtitle("Select one of the following functions.")
				.buttons([
					builder.CardAction.imBack(session, "Imgur", "Imgur (General)"),
					builder.CardAction.imBack(session, "Flickr", "Flickr (Photo)"),
					builder.CardAction.imBack(session, "IbSearch", "IbSearch (Anime)"),
					builder.CardAction.imBack(session, "Pixiv", "Pixiv (Anime)"),
					builder.CardAction.imBack(session, "Cat", "Cat"),
					builder.CardAction.imBack(session, "Snake", "Snake"),
					builder.CardAction.imBack(session, "Bunny", "Bunny"),
					builder.CardAction.imBack(session, "Back to Main Menu", "Back to Main Menu"),
					builder.CardAction.imBack(session, "Quit", "Quit")
				])
			]);
			builder.Prompts.text(session, msg);
		}
	},
	function (session, results) {
		if (results.response.endsWith("Cat")) {
			session.beginDialog("/cat");
		}
		else if (results.response.endsWith("Snake")) {
			session.beginDialog("/snake");
		}
		else if (results.response.endsWith("Bunny")) {
			session.beginDialog("/bunny");
		}
		else if (results.response.startsWith("Imgur") || results.response.toLowerCase().startsWith("@metagon imgur")) {
			session.beginDialog("/imgur1");
		}
		else if (results.response.startsWith("Flickr") || results.response.toLowerCase().startsWith("@metagon flickr")) {
			session.beginDialog("/flickr1");
		}
		else if (results.response.startsWith("IbSearch") || results.response.toLowerCase().startsWith("@metagon ibsearch")) {
			session.beginDialog("/ibsearch1");
		}
		else if (results.response.startsWith("Pixiv") || results.response.toLowerCase().startsWith("@metagon pixiv")) {
			session.beginDialog("/pixiv1");
		}
		else if (results.response.endsWith("Quit")) {
			session.endDialog("You have quitted the keyboard mode. You can start again by typing \"/start\".");
		}
		else if (results.response.endsWith("Back to Main Menu")) {
			session.replaceDialog("/menu");
		}
	}
]);

bot.beginDialogAction("utility", "/utility", { matches: /Utility/g});
bot.dialog('/utility', [
	function (session) {
		if (session.message.source === "groupme" || session.message.source === "skypeforbusiness") {
			session.endDialog("Keyboard Mode is not available on GroupMe / Skype for Business. Please use only commands.\nFor more information, type \"help\".");
}
		else {
			var msg = new builder.Message(session);
			msg.attachmentLayout(builder.AttachmentLayout.carousel)
			msg.attachments([
				new builder.HeroCard(session)
				.title("What would you like to do right now?")
				.subtitle("Select one of the following functions.")
				.buttons([
					builder.CardAction.imBack(session, "Shorten URLs", "Shorten URLs"),
					builder.CardAction.imBack(session, "Expand Bitly URLs", "Expand Bitly URLs"),
					builder.CardAction.imBack(session, "Minecraft User Lookup", "Minecraft User Lookup"),
					builder.CardAction.imBack(session, "Minecraft Server Status", "Minecraft Server Status"),
					builder.CardAction.imBack(session, "Yelp", "Yelp"),
					builder.CardAction.imBack(session, "Pastebin", "Pastebin (Paste text online)"),
					builder.CardAction.imBack(session, "Back to Main Menu", "Back to Main Menu"),
					builder.CardAction.imBack(session, "Quit", "Quit")
				])
			]);
			builder.Prompts.text(session, msg);
		}
	}, 
	function (session, results) {
		if (results.response.endsWith("Shorten URLs")) {
			session.beginDialog("/shorten1");
		}
		else if (results.response.endsWith("Expand Bitly URLs")) {
			session.beginDialog("/expand1");
		}
		else if (results.response.endsWith("Minecraft User Lookup")) {
			session.beginDialog("/mcuser1");
		}
		else if (results.response.endsWith("Minecraft Server Status")) {
			session.beginDialog("/mcserver1");
		}
		else if (results.response.endsWith("Yelp")) {
			session.send("Coming soon™");
		}
		else if (results.response.startsWith("Pastebin") || results.response.toLowerCase().startsWith("@metagon pastebin")) {
			session.beginDialog("/paste1");
		}
		else if (results.response.endsWith("Quit")) {
			session.endDialog("You have quitted the keyboard mode. You can start again by typing \"/start\".");
		}
		else if (results.response.endsWith("Back to Main Menu")) {
			session.replaceDialog("/menu");
		}
	}
]);

bot.beginDialogAction("fun", "/fun", { matches: /Fun/g});
bot.dialog('/fun', [
	function (session) {
		if (session.message.source === "groupme" || session.message.source === "skypeforbusiness") {			session.endDialog("Keyboard Mode is not available on GroupMe / Skype for Business. Please use only commands.\nFor more information, type \"help\".");
	}
		else {
			var msg = new builder.Message(session);
			msg.attachmentLayout(builder.AttachmentLayout.carousel)
			msg.attachments([
				new builder.HeroCard(session)
				.title("What would you like to do right now?")
				.subtitle("Select one of the following functions.")
				.buttons([
					builder.CardAction.imBack(session, "9gag", "9gag"),
					builder.CardAction.imBack(session, "Chuck Norris", "Chuck Norris"),
					builder.CardAction.imBack(session, "Yoda Quote", "Random Yoda Quote"),
					builder.CardAction.imBack(session, "Quote on Design", "Quote on Design"),
					builder.CardAction.imBack(session, "Back to Main Menu", "Back to Main Menu"),
					builder.CardAction.imBack(session, "Quit", "Quit")
				])
			]);
			builder.Prompts.text(session, msg);
		}
	},
	function (session, results) {
		if (results.response.endsWith("Yoda Quote")) {
			session.beginDialog("/yoda");
		}
		else if (results.response.endsWith("Norris")) {
			session.beginDialog("/joke");
		}
		else if (results.response.endsWith("Design")) {
			session.beginDialog("/design");
		}
		else if (results.response.endsWith("Quit")) {
			session.endDialog("You have quitted the keyboard mode. You can start again by typing \"/start\".");
		}
		else if (results.response.endsWith("Back to Main Menu")) {
			session.replaceDialog("/menu");
		}
	}
]);

bot.beginDialogAction("about", "/about", { matches: /About\/Support/g});
bot.beginDialogAction("help", "/about", { matches: /help/i});
bot.dialog('/about', function (session) {
	if (session.message.source === "kik") {
	session.endDialog("Thank you for using Metagon. Originally in Discord, I am a multi-platform multi-function bot to suit your needs!\n\nDocumentation: http://metagon.cf\n\nIf you have any questions, feel free to contact my master at @austinhuang0131.\n\nDo I help you a lot? Consider a small donation (Detail in documentation)!");
	}
	else if (session.message.source === "skype") {
	session.endDialog("Thank you for using Metagon. Originally in Discord, I am a multi-platform multi-function bot to suit your needs!\n\nDocumentation: http://metagon.cf\n\nIf you have any questions, feel free to contact my master at \"live:austin.0131\".\n\nDo I help you a lot? Consider a small donation (Detail in documentation)!");
	}
	else {
	session.endDialog("Thank you for using Metagon. Originally in Discord, I am a multi-platform multi-function bot to suit your needs!\n\nDocumentation/Contact Us: http://metagon.cf\n\nDo I help you a lot? Consider a small donation (Detail in documentation)!");
	}
});

// Image
bot.beginDialogAction("cat", "/cat", { matches: /\/cat/g});
bot.dialog('/cat', function (session) {
	request('http://random.cat/meow', function(error, response, body) {
		if (!error && response.statusCode === 200 && session.message.text === "/cat") {
			body = JSON.parse(body);
			session.endDialog({
				attachments: [
					{
						contentType: "image/*",
						contentUrl: body.file
					}
				]
			});
		}
		else if (!error && response.statusCode === 200) {
			body = JSON.parse(body);
			session.endDialog({
				attachments: [
					{
						contentType: "image/*",
						contentUrl: body.file
					}
				]
			});
			session.replaceDialog("/image");
		}
		else {
			session.endDialog("ERROR! I could not connect to http://random.cat/meow. Please retry. If the problem persists, leave an issue at http://metagon.cf");
		}
	});
});

bot.beginDialogAction("snake", "/snake", { matches: /\/snake/g});
bot.dialog('/snake', function (session) {
	request('http://fur.im/snek/snek.php', function(error, response, body) {
		if (!error && response.statusCode === 200 && session.message.text === "/snake") {
			body = JSON.parse(body);
			session.endDialog({
  				attachments: [
  					{
  						contentType: "image/*",
 						contentUrl: body.file
 					}
  				]
  			});
  		}
		else if (!error && response.statusCode === 200) {
			body = JSON.parse(body);
			session.endDialog({
  				attachments: [
  					{
  						contentType: "image/*",
 						contentUrl: body.file
 					}
  				]
  			});
			session.replaceDialog("/image");
  		}
		else {
			session.endDialog("ERROR! I could not connect to http://fur.im/snek/snek.php. Please retry. If the problem persists, leave an issue at http://metagon.cf");
		}
	});
});

bot.beginDialogAction("bunny", "/bunny", { matches: /\/bunny/g});
bot.dialog('/bunny', function (session) {
	request('https://api.bunnies.io/v2/loop/random/?media=gif,mp4', function(error, response, body) {
		if (!error && response.statusCode === 200 && session.message.text === "/bunny" && session.message.source.includes("skype")) {
			body = JSON.parse(body);
			session.endDialog({
  				attachments: [
  					{
  						contentType: "video/mp4",
 						contentUrl: body.media.mp4
 					}
  				]
  			});
  		}
		else if (!error && response.statusCode === 200 && session.message.text === "/bunny") {
			body = JSON.parse(body);
			session.endDialog({
				attachments: [
					{
						contentType: "image/gif",
						contentUrl: body.media.gif
					}
				]
			});
		}
		else if (!error && response.statusCode === 200 && session.message.source.includes("skype")) {
			body = JSON.parse(body);
			session.endDialog({
  				attachments: [
  					{
  						contentType: "video/mp4",
 						contentUrl: body.media.mp4
 					}
  				]
  			});
			session.replaceDialog("/image");
  		}
		else if (!error && response.statusCode === 200) {
			body = JSON.parse(body);
			session.endDialog({
  				attachments: [
  					{
  						contentType: "image/gif",
 						contentUrl: body.media.gif
 					}
  				]
  			});
			session.replaceDialog("/image");
  		}
		else {
			session.endDialog("ERROR! I could not connect to https://api.bunnies.io/v2/loop/random/?media=gif,mp4 . Please retry. If the problem persists, leave an issue at http://metagon.cf");
		}
	});
});

bot.beginDialogAction("imgur", "/imgur2", { matches: /\/imgur/g});
bot.dialog('/imgur1',[
	function (session) {
		var msg = new builder.Message(session);
		msg.attachmentLayout(builder.AttachmentLayout.carousel)
		msg.attachments([
			new builder.HeroCard(session)
			.title("Input a search query.")
			.subtitle("ProTip: Supports boolean operators (AND, OR, NOT) and indices (tag: user: title: ext: subreddit: album: meme:).")
			.buttons([
				builder.CardAction.imBack(session, "Back to Image Menu", "Back to Image Menu")
			])
		]);
		builder.Prompts.text(session, msg);
	},
	function (session, results, next) {
		if (results.response !== "Back to Image Menu") {
			request({url:"https://api.imgur.com/3/gallery/search?q="+results.response, headers:{'Authorization': 'Client-ID '+process.env.imgur}}, function(error, response, body) {
				if (!error && response.statusCode === 200) {
					body = JSON.parse(body);
					if (body.data === []) {
						session.endDialog("No results. Change your query?");
						session.replaceDialog("/image");
					}
					else {
						session.endDialog(body.data[Math.floor(Math.random() * body.data.length)].link);
						session.replaceDialog("/image");
					}
				}
				else {
					session.endDialog("Failed to connect to http://imgur.com");
					session.replaceDialog("/image");
				}
			});
		}
		else {
			session.replaceDialog("/image");
		}
    }]);
bot.dialog('/imgur2', function (session) {
	if (session.message.text.split(" ").slice(1).join(" ") !== "" && session.message.text.startsWith("/imgur")) {
		request({url:"https://api.imgur.com/3/gallery/search?q="+session.message.text.substring(7), headers:{'Authorization': 'Client-ID '+process.env.imgur}}, function(error, response, body) {
			if (!error && response.statusCode === 200 && session.message.source === "kik") {
				var msg = new builder.Message(session);
				msg.attachmentLayout(builder.AttachmentLayout.carousel)
				msg.attachments([
					new builder.HeroCard(session)
					.text()
					.buttons([
						builder.CardAction.imBack(session, "Imgur", "Imgur (General)"),
						builder.CardAction.imBack(session, "Flickr", "Flickr (Photo)"),
						builder.CardAction.imBack(session, "IbSearch", "IbSearch (Anime)"),
						builder.CardAction.imBack(session, "Pixiv", "Pixiv (Anime)"),
						builder.CardAction.imBack(session, "Cat", "Cat"),
						builder.CardAction.imBack(session, "Snake", "Snake"),
						builder.CardAction.imBack(session, "Bunny", "Bunny"),
						builder.CardAction.imBack(session, "Back to Main Menu", "Back to Main Menu")
					])
				]);
				session.endDialog(msg);
			}
			else if (!error && response.statusCode === 200) {
				body = JSON.parse(body);
				if (body.data === []) {session.endDialog("No results. Change your query?");}
				else {session.endDialog(body.data[Math.floor(Math.random() * body.data.length)].link);}
			}
			else {session.endDialog("Failed to connect to http://imgur.com");}
		});
	}
	else if (session.message.text.startsWith("/imgur")) {
		session.endDialog("Missing search query! Correct usage: \"/imgur <Query>\"");
	}
	else {
		session.endDialog();
	}
});

bot.beginDialogAction("flickr", "/flickr2", { matches: /\/flickr/g});
bot.dialog('/flickr1',[
	function (session) {
		var msg = new builder.Message(session);
		msg.attachmentLayout(builder.AttachmentLayout.carousel)
		msg.attachments([
			new builder.HeroCard(session)
			.title("Input a search query.")
			.buttons([
				builder.CardAction.imBack(session, "Back to Image Menu", "Back to Image Menu")
			])
		]);
		builder.Prompts.text(session, msg);
	},
	function (session, results, next) {
		if (results.response !== "Back to Image Menu") {
			request("https://api.flickr.com/services/rest?api_key="+process.env.flickr+"&method=flickr.photos.search&text="+results.response+"&format=json&per_page=500&nojsoncallback=1", function(error, response, body) {
				if (!error && response.statusCode === 200) {
					body = JSON.parse(body);
					var photo = body.photos.photo[Math.floor(Math.random() * body.photos.photo.length)];
					request("https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+process.env.flickr+"&photo_id="+photo.id+"&format=json&nojsoncallback=1", function(error, response, body) {
						if (!error && response.statusCode === 200) {
							body = JSON.parse(body);
							session.endDialog({
								text: photo.title,
								attachments: [
									{
										contentType: "image/*",
										contentUrl: body.sizes.size[body.sizes.size.length - 1].source
									}
								]
							});
							session.replaceDialog("/image");
					}
						else {
							session.endDialog("Failed to connect to http://flickr.com");
							session.replaceDialog("/image");
						}
					});
				}
				else {
					session.endDialog("Failed to connect to http://flickr.com");
					session.replaceDialog("/image");
				}
			});
		}
		else {
			session.replaceDialog("/image");
		}
    }]);
bot.dialog('/flickr2', function (session) {
	if (session.message.text.split(" ").slice(1).join(" ") !== "" && session.message.text.startsWith("/flickr")) {
		request("https://api.flickr.com/services/rest?api_key="+process.env.flickr+"&method=flickr.photos.search&text="+session.message.text.substring(9)+"&format=json&per_page=500&nojsoncallback=1", function(error, response, body) {
			if (!error && response.statusCode === 200) {
				body = JSON.parse(body);
				var photo = body.photos.photo[Math.floor(Math.random() * body.photos.photo.length)];
				request("https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+process.env.flickr+"&photo_id="+photo.id+"&format=json&nojsoncallback=1", function(error, response, body) {
					if (!error && response.statusCode === 200) {
						body = JSON.parse(body);
						session.endDialog({
							text: photo.title,
							attachments: [
								{
									contentType: "image/*",
									contentUrl: body.sizes.size[body.sizes.size.length - 1].source
								}
							]
						});
					}
					else {session.endDialog("Failed to connect to http://flickr.com");}
				});
			}
			else {session.endDialog("Failed to connect to http://flickr.com");}
		});
	}
	else if (session.message.text.startsWith("/flickr")) {
		session.endDialog("Missing search query! Correct usage: \"/flickr <Query>\"");
	}
	else {
		session.endDialog();
	}
});

bot.beginDialogAction("ibsearch", "/ibsearch2", { matches: /\/ibsearch/g});
bot.dialog('/ibsearch1',[
	function (session) {
		var msg = new builder.Message(session);
		msg.attachmentLayout(builder.AttachmentLayout.carousel)
		msg.attachments([
			new builder.HeroCard(session)
			.title("Show NSFW content?")
			.subtitle("Make sure you're legal to do this, because we're not liable for anything you've done!")
			.buttons([
				builder.CardAction.imBack(session, "Yes", "Yes"),
				builder.CardAction.imBack(session, "No", "No")
			])
		]);
		builder.Prompts.confirm(session, msg);
	},
	function (session, results) {
		if (results.response === false) {
			nsfw.push({user: session.message.address.user.id, nsfw: "+rating:s"});
			fs.writeFile("./nsfw.json", JSON.stringify(nsfw), "utf8");
		}
		else if (results.response === true) {
			nsfw.push({user: session.message.address.user.id, nsfw: ""});
			fs.writeFile("./nsfw.json", JSON.stringify(nsfw), "utf8");
		}
		var msg = new builder.Message(session);
		msg.attachmentLayout(builder.AttachmentLayout.carousel)
		msg.attachments([
			new builder.HeroCard(session)
			.title("You chose "+results.response+" for NSFW visibility. Input a search query.")
			.subtitle("After your input, wait patiently as it takes time to send the image!")
			.buttons([
				builder.CardAction.imBack(session, "Back to Image Menu", "Back to Image Menu")
			])
		]);
		builder.Prompts.text(session, msg);
	},
	function (session, results) {
		request("https://ibsearch.xxx/api/v1/images.json?key="+process.env.ibsearch+"&limit=1&q=random:+"+results.response+nsfw.find(i => {return i.user === session.message.address.user.id}).nsfw, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				if (body !== "[]") {
					body = JSON.parse(body);
					session.endDialog({
						attachments: [
							{
								contentType: "image/*",
								contentUrl: "https://"+body[0].server+".ibsearch.xxx/"+body[0].path
							}
						]
					});
					session.replaceDialog("/image");
				}
				else {
					session.endDialog("No result. Change your query?");
					session.replaceDialog("/image");
				}
			}
			else {
				session.endDialog("Failed to connect to http://ibsearch.xxx");
				session.replaceDialog("/image");
			}
		});
		nsfw.splice(nsfw.indexOf(nsfw.find(i => {return i.user === session.message.address.user.id})), 1);
    }
]);
bot.dialog('/ibsearch2',[
	function (session) {
		nsfw.push({user: session.message.address.user.id, query: session.message.text.substring(11)});
		fs.writeFile("./nsfw.json", JSON.stringify(nsfw), "utf8");
		if (session.message.source !== "groupme") {
			var msg = new builder.Message(session);
			msg.attachmentLayout(builder.AttachmentLayout.carousel)
			msg.attachments([
				new builder.HeroCard(session)
				.title("Show NSFW content?")
				.subtitle("Make sure you're legal to do this, because we're not liable for anything you've done!")
				.buttons([
					builder.CardAction.imBack(session, "Yes", "Yes"),
					builder.CardAction.imBack(session, "No", "No")
				])
			]);
			builder.Prompts.confirm(session, msg);
		}
		else {
			builder.Prompts.confirm(session, "Do you want me to show NSFW content? Make sure you're legal to do this, because we're not liable for anything you've done! Type \"yes\" or \"no\".");
		}
	},
	function (session, results) {
		var rating = "";
		if (results.response === false) {rating = "rating:s";}
		request("https://ibsearch.xxx/api/v1/images.json?key="+process.env.ibsearch+"&limit=1&q=random:+"+nsfw.find(i => {return i.user === session.message.address.user.id}).query+"+"+rating, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				if (body !== "[]") {
					body = JSON.parse(body);
					session.endDialog({
						attachments: [
							{
								contentType: "image/*",
								contentUrl: "https://"+body[0].server+".ibsearch.xxx/"+body[0].path
							}
						]
					});
				}
				else {
					session.endDialog("No result. Change your query? Was "+nsfw.find(i => {return i.user === session.message.address.user.id}).query);
				}
			}
			else {
				session.endDialog("Failed to connect to http://ibsearch.xxx");
			}
		});
		nsfw.splice(nsfw.indexOf(nsfw.find(i => {return i.user === session.message.address.user.id})), 1);
    }
]);

bot.beginDialogAction("pixiv", "/pixiv2", { matches: /\/pixiv/g});
bot.dialog('/pixiv1',[
	function (session) {
		var msg = new builder.Message(session);
		msg.attachmentLayout(builder.AttachmentLayout.carousel)
		msg.attachments([
			new builder.HeroCard(session)
			.title("Show NSFW content?")
			.subtitle("Make sure you're legal to do this, because we're not liable for anything you've done!")
			.buttons([
				builder.CardAction.imBack(session, "Yes", "Yes"),
				builder.CardAction.imBack(session, "No", "No")
			])
		]);
		builder.Prompts.confirm(session, msg);
	},
	function (session, results) {
		if (results.response === false) {
			nsfw.push({user: session.message.address.user.id, nsfw: " -R-18 -R-18G"});
			fs.writeFile("./nsfw.json", JSON.stringify(nsfw), "utf8");
		}
		else if (results.response === true) {
			nsfw.push({user: session.message.address.user.id, nsfw: ""});
			fs.writeFile("./nsfw.json", JSON.stringify(nsfw), "utf8");
		}
		var msg = new builder.Message(session);
		msg.attachmentLayout(builder.AttachmentLayout.carousel)
		msg.attachments([
			new builder.HeroCard(session)
			.title("You chose "+results.response+" for NSFW visibility. Input a search query.")
			.buttons([
				builder.CardAction.imBack(session, "Back to Image Menu", "Back to Image Menu")
			])
		]);
		builder.Prompts.text(session, msg);
	},
	function (session, results) {
		pixiv.search(results.response+nsfw.find(i => {return i.user === session.message.address.user.id}).nsfw, {per_page: 100, mode: "tag"}).then(json => {
			var illust = json.response[Math.floor(Math.random() * json.response.length)];
			if (illust === undefined) {
				session.endDialog("No results.");
				session.replaceDialog("/image");
			}
			else {
				var msg = "";
				if (illust.is_manga === true) {msg += "\nThis is a multiple-page illustration, so only the first page is shown. View the full content at http://www.pixiv.net/member_illust.php?mode=medium&illust_id="+illust.id;}
				pixivImg(illust.image_urls.large).then(output => {
					imgurUploader(fs.readFileSync(output), {title: "http://metagon.js.org"}, process.env.imgur).then(urls => {
						session.endDialog({
							text: msg,
							attachments: [
								{
									contentType: "image/*",
									contentUrl: urls.link
								}
							]
						});
						session.replaceDialog("/image");
					});
				});
			}
		});
		nsfw.splice(nsfw.indexOf(nsfw.find(i => {return i.user === session.message.address.user.id})), 1);
    }
]);
bot.dialog('/pixiv2',[
	function (session) {
		nsfw.push({user: session.message.address.user.id, query: session.message.text.substring(8)});
		fs.writeFile("./nsfw.json", JSON.stringify(nsfw), "utf8");
		if (session.message.source !== "groupme") {
			var msg = new builder.Message(session);
			msg.attachmentLayout(builder.AttachmentLayout.carousel)
			msg.attachments([
				new builder.HeroCard(session)
				.title("Show NSFW content?")
				.subtitle("Make sure you're legal to do this, because we're not liable for anything you've done!")
				.buttons([
					builder.CardAction.imBack(session, "Yes", "Yes"),
					builder.CardAction.imBack(session, "No", "No")
				])
			]);
			builder.Prompts.confirm(session, msg);
		}
		else {
			builder.Prompts.confirm(session, "Do you want me to show NSFW content? Make sure you're legal to do this, because we're not liable for anything you've done! Type \"yes\" or \"no\".");
		}
	},
	function (session, results) {
		var rating = "";
		if (results.response === false) {rating = " -R-18 -R-18G";}
		pixiv.search(nsfw.find(i => {return i.user === session.message.address.user.id}).query+rating, {per_page: 100, mode: "tag"}).then(json => {
			var illust = json.response[Math.floor(Math.random() * json.response.length)];
			if (illust === undefined) {
				session.endDialog("No results.");
			}
			else {
				var msg = "";
				if (illust.is_manga === true) {msg += "\nThis is a multiple-page illustration, so only the first page is shown. View the full content at http://www.pixiv.net/member_illust.php?mode=medium&illust_id="+illust.id;}
				pixivImg(illust.image_urls.large).then(output => {
					imgurUploader(fs.readFileSync(output), {title: "http://metagon.js.org"}, process.env.imgur).then(urls => {
						session.endDialog({
							text: msg,
							attachments: [
								{
									contentType: "image/*",
									contentUrl: urls.link
								}
							]
						});
					});
				});
			}
		});
		nsfw.splice(nsfw.indexOf(nsfw.find(i => {return i.user === session.message.address.user.id})), 1);
    }
]);

// Utility
bot.beginDialogAction("shorten", "/shorten2", { matches: /\/shorten/g});
bot.dialog('/shorten1',[
	function (session) {
		var msg = new builder.Message(session);
		msg.attachmentLayout(builder.AttachmentLayout.carousel)
		msg.attachments([
			new builder.HeroCard(session)
			.title("Input the URL you'd like to shorten.")
			.subtitle("ProTip: Does not need http://")
			.buttons([
				builder.CardAction.imBack(session, "Back to Utility Menu", "Back to Utility Menu")
			])
		]);
		builder.Prompts.text(session, msg);
	},
	function (session, results) {
		var site = "";
		if (!results.response.startsWith("http")) {site = "http://"+results.response;} else {site = results.response;}
		request("https://api-ssl.bitly.com/v3/shorten?access_token="+process.env.bitly_token+"&longUrl="+site+"&format=txt", function(error, response, body) {
			if (!error && response.statusCode === 200) {
				session.endDialog("Done! "+body);
				session.replaceDialog("/utility");
			}
			else {
				session.endDialog("An error occured. Invalid address, or retry?");
				session.replaceDialog("/utility");
			}
		});
    }
]);
bot.dialog('/shorten2', function (session) {
	var site = "";
	if (!session.message.text.substring(9).startsWith("http")) {site = "http://"+session.message.text.substring(9);} else {site = session.message.text.substring(9);}
	request("https://api-ssl.bitly.com/v3/shorten?access_token="+process.env.bitly_token+"&longUrl="+site+"&format=txt", function(error, response, body) {
		if (!error && response.statusCode === 200) {
			session.endDialog("Done! "+body);
	}
		else {
			session.endDialog("An error occured. Invalid address, or retry?");
		}
	});
});

bot.beginDialogAction("shorten", "/expand2", { matches: /\/expand/g});
bot.dialog('/expand1',[
	function (session) {
		var msg = new builder.Message(session);
		msg.attachmentLayout(builder.AttachmentLayout.carousel)
		msg.attachments([
			new builder.HeroCard(session)
			.title("Input the URL you'd like to expand.")
			.subtitle("ProTip: Does not need http://")
			.buttons([
				builder.CardAction.imBack(session, "Back to Utility Menu", "Back to Utility Menu")
			])
		]);
		builder.Prompts.text(session, msg);
	},
	function (session, results) {
		var site = "";
		if (!results.response.startsWith("http")) {site = "http://"+results.response;} else {site = results.response;}
		request("https://api-ssl.bitly.com/v3/expand?access_token="+process.env.bitly_token+"&shortUrl="+site+"&format=txt", function(error, response, body) {
			if (!error && response.statusCode === 200) {
				session.endDialog("Done! "+body);
				session.replaceDialog("/utility");
			}
			else {
				session.endDialog("An error occured. Invalid address, or retry?");
				session.replaceDialog("/utility");
			}
		});
    }
]);
bot.dialog('/expand2', function (session){
	request("https://api-ssl.bitly.com/v3/expand?access_token="+process.env.bitly_token+"&shortUrl="+session.message.text.substring(9)+"&format=txt", function(error, response, body) {
		var site = "";
		if (!session.message.text.substring(8).startsWith("http")) {site = "http://"+session.message.text.substring(8);} else {site = session.message.text.substring(8);}
		if (!error && response.statusCode === 200) {
			session.endDialog("Done! "+body);
		}
		else {
			session.endDialog("An error occured. Invalid address, or retry?");
		}
	});
});

bot.beginDialogAction("mcuser", "/mcuser2", { matches: /\/mcuser/g});
bot.dialog('/mcuser1',[
	function (session) {
		var msg = new builder.Message(session);
		msg.attachmentLayout(builder.AttachmentLayout.carousel)
		msg.attachments([
			new builder.HeroCard(session)
			.title("Input the username or UUID you'd like to look up.")
			.buttons([
				builder.CardAction.imBack(session, "Back to Utility Menu", "Back to Utility Menu")
			])
		]);
		builder.Prompts.text(session, msg);
	},
	function (session, results) {
		request('http://mcapi.de/api/user/' + results.response, function(error, response, body) {
			if (!error) {
				var mcapi = JSON.parse(body);
				if (mcapi.result.status === "Ok") {
					session.send(mcapi.username+" (UUID: "+mcapi.uuid+")\n* Name history: "+mcapi.history.map(h => h.name).splice(mcapi.history.length - 1, 1).join(", ")+"\n\n== Appearance ==\n* Body: https://crafatar.com/renders/body/"+mcapi.uuid+"\n* Skin: https://crafatar.com/skins/"+mcapi.uuid+"\n* Cape: https://crafatar.com/cape/"+mcapi.uuid);
					request('http://mcapi.de/api/user/'+mcapi.uuid+'/reputation', function(error, response, body) {
						var mcrep = JSON.parse(body);
						if (!body.includes('"services":[]')) {
							session.endDialog("Reputation: "+mcrep.reputation+"/10\n\nRecorded bans:\n\nMCBans: "+mcrep.services.mcbans[0].amount+" / Glizer: "+mcrep.services.glizer[0].amount+" / MCBouncer: "+mcrep.services.mcbouncer[0].amount);
							session.replaceDialog("/utility");
						}
						else {
							session.endDialog();
							session.replaceDialog("/utility");
						}
					});
				}
				else if (mcapi.result.status === "The service is currently cooling down and cannot perform any requests. Please try it later again.") {
					session.endDialog("The user should be cracked (Not registered with Mojang). Or the Mojang server broke. Who knows.");
					session.replaceDialog("/utility");
				}
				else {
					session.endDialog("An error occurred.");
					session.replaceDialog("/utility");
				}
			}
			else {
				session.endDialog("An error occurred.");
				session.replaceDialog("/utility");
			}
		});
    }
]);
bot.dialog('/mcuser2', function (session) {
	request('http://mcapi.de/api/user/' + session.message.text.substring(8).replace(" ", ""), function(error, response, body) {
		if (!error) {
			var mcapi = JSON.parse(body);
			if (mcapi.result.status === "Ok") {
				request('http://mcapi.de/api/user/'+mcapi.uuid+'/reputation', function(error, response, body) {
					var mcrep = JSON.parse(body);
					session.send(mcapi.username+" (UUID: "+mcapi.uuid+")\n* Name history: "+mcapi.history.map(h => h.name).splice(mcapi.history.length - 1, 1).join(", ")+"\n\n== Appearance ==\n* Body: https://crafatar.com/renders/body/"+mcapi.uuid+"\n* Skin: https://crafatar.com/skins/"+mcapi.uuid+"\n* Cape: https://crafatar.com/cape/"+mcapi.uuid);
					request('http://mcapi.de/api/user/'+mcapi.uuid+'/reputation', function(error, response, body) {
						var mcrep = JSON.parse(body);
						if (!body.includes('"services":[]')) {
							session.endDialog("Reputation: "+mcrep.reputation+"/10\n\nRecorded bans:\n\nMCBans: "+mcrep.services.mcbans[0].amount+" / Glizer: "+mcrep.services.glizer[0].amount+" / MCBouncer: "+mcrep.services.mcbouncer[0].amount);
						}
						else {
							session.endDialog();
						}
					});
				});
			}
			else if (mcapi.result.status === "The service is currently cooling down and cannot perform any requests. Please try it later again.") {
				session.endDialog("The user should be cracked (Not registered with Mojang). Or the Mojang server broke. Who knows.");
			}
			else {
				session.endDialog("An error occurred.");
			}
		}
		else {
			session.endDialog("An error occurred.");
		}
	});
});

bot.beginDialogAction("mcserver", "/mcserver2", { matches: /\/mcserver/g});
bot.dialog('/mcserver1',[
	function (session) {
		var msg = new builder.Message(session);
		msg.attachmentLayout(builder.AttachmentLayout.carousel)
		msg.attachments([
			new builder.HeroCard(session)
			.title("Input the server IP/address you'd like to look up.")
			.buttons([
				builder.CardAction.imBack(session, "Back to Utility Menu", "Back to Utility Menu")
			])
		]);
		builder.Prompts.text(session, msg);
	},
	function (session, results) {
		var ip = {};
		if (results.response.split(":")[1] === undefined) {
			ip = {ip: results.response};
		}
		else {
			ip = {ip: results.response.split(":")[0], port: results.response.split(":")[1]};
		}
		request.post('https://mcapi.de/api/server/', {json: ip}, function(error, response, body) {
			if (!error) {
				if (body.result.status === "success") {
					session.endDialog({
						text: results.response+" ("+body.hostname+")\n* Players: "+body.players.online+"/"+body.players.max+"\n* Blocked by Mojang: "+body.blocked.status+"\n* Software: "+body.software.name+", MC Version "+body.software.version+"\n* Ping: "+body.list.ping+"ms",
						attachments: [
							{
								contentType: "image/*",
								contentUrl: "https://api.minetools.eu/favicon/"+results.response.replace(":", "/")
							}
						]
					});
					session.replaceDialog("/utility");
				}
				else {
					session.endDialog('Your input is invalid, or the server you requested is offline, or maybe you just need a retry.\nYour input is '+results.response);
					session.replaceDialog("/utility");
				}
			}
			else {
				session.endDialog("An error occurred.");
				session.replaceDialog("/utility");
			}
		});
    }
]);
bot.dialog('/mcserver2', function (session) {
	var ip = {};
	if (session.message.text.substring(10).split(":")[1] === undefined) {
		ip.ip = session.message.text.substring(10).replace(" ", "");
	}
	else {
		ip.ip = session.message.text.substring(10).split(":")[0].replace(" ", "");
		ip.port = session.message.text.substring(10).split(":")[1];
	}
	request.post('https://mcapi.de/api/server/', {json: ip}, function(error, response, body) {
		if (!error) {
			console.log(ip);
			if (body.result.status === "success") {
				session.endDialog({
					text: session.message.text.substring(10)+" ("+body.hostname+")\n* Players: "+body.players.online+"/"+body.players.max+"\n* Blocked by Mojang: "+body.blocked.status+"\n* Software: "+body.software.name+", MC Version "+body.software.version+"\n* Ping: "+body.list.ping+"ms",
					attachments: [
						{
							contentType: "image/*",
							contentUrl: "https://api.minetools.eu/favicon/"+session.message.text.substring(10).replace(" ", "").replace(":", "/")
						}
					]
				});
			}
			else {
				session.endDialog('Your input is invalid, or the server you requested is offline, or maybe you just need a retry.\nYour input is '+session.message.text.substring(10));
			}
		}
		else {
			session.endDialog("An error occurred.");
		}
	});
});

bot.beginDialogAction("paste", "/paste2", { matches: /\/paste/g});
bot.dialog('/paste1',[
	function (session) {
		var msg = new builder.Message(session);
		msg.attachmentLayout(builder.AttachmentLayout.carousel)
		msg.attachments([
			new builder.HeroCard(session)
			.title("Input the content you'd like to paste.")
			.buttons([
				builder.CardAction.imBack(session, "Back to Utility Menu", "Back to Utility Menu")
			])
		]);
		builder.Prompts.text(session, msg);
	},
	function (session, results) {
		request.post('https://pastebin.com/api/api_post.php', {form: {api_dev_key: process.env.pastebin, api_option: "paste", api_paste_code: results.response}}, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				session.endDialog("Done! "+body);
				session.replaceDialog("/utility");
			}
			else {
				session.endDialog("An error occurred.");
				session.replaceDialog("/utility");
			}
		});
    }
]);
bot.dialog('/paste2', function (session) {
	request.post('https://pastebin.com/api/api_post.php', {form: {api_dev_key: process.env.pastebin, api_option: "paste", api_paste_code: session.message.text.substring(7).replace(" ", "")}}, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			session.endDialog("Done! "+body);
		}
		else {
			session.endDialog("An error occurred.");
		}
	});
});

// Fun
bot.beginDialogAction("joke", "/joke", { matches: /\/joke/g});
bot.dialog('/joke', function (session) {
	request('http://api.icndb.com/jokes/random?escape=javascript', function(error, response, body) {
		if (!error && response.statusCode === 200 && session.message.text === "/joke") {
			body = JSON.parse(body);
			session.endDialog(body.value.joke);
		}
		else if (!error && response.statusCode === 200) {
			body = JSON.parse(body);
			session.endDialog(body.value.joke);
			session.replaceDialog("/fun");
		}
		else {
			session.endDialog("ERROR! I could not connect to http://api.icndb.com/jokes/random. Please retry. If the problem persists, leave an issue at http://metagon.cf");
		}
	});
});

bot.beginDialogAction("yoda", "/yoda", { matches: /\/yoda/g});
bot.dialog('/yoda', function (session) {
		if (session.message.text === "/yoda") {
			session.endDialog(yoda_said[Math.floor(Math.random() * yoda_said.length)]);
		}
		else {
			session.endDialog(yoda_said[Math.floor(Math.random() * yoda_said.length)]);
			session.replaceDialog("/fun");
		}
});

bot.beginDialogAction("design", "/design", { matches: /\/design/g});
bot.dialog('/design', function (session) {
	request('http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1', function(error, response, body) {
		if (!error && response.statusCode === 200 && session.message.text === "/design") {
			body = JSON.parse(body);
			session.endDialog(body[0].content.replace("<p>", "").replace("</p>", "")+"\n\n--- "+body[0].title);
		}
		else if (!error && response.statusCode === 200) {
			body = JSON.parse(body);
			session.endDialog(body[0].content.replace("<p>", "").replace("</p>", "")+"\n\n--- "+body[0].title);
			session.replaceDialog("/fun");
		}
		else {
			session.endDialog("ERROR! I could not connect to http://quotesondesign.com/wp-json/posts. Please retry. If the problem persists, leave an issue at http://metagon.cf");
		}
	});
});

// General Guidance
bot.dialog('/', function (session) {
    session.endDialog('It seems like you\'re confused. Maybe try typing \"help\".');
});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.PORT || 5000, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
