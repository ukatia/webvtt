// array with cues
var cues = [];
// boolean: video is playing
var isPlaying = false;
// subtitles file
var subtitles = $( "input[name='video_subtitles']" ).val(); 

// get video element
var vid = document.getElementById('videoMain');

vid.src = $( "input[name='video_src']" ).val();

updateSubtitles();

// update video on input video source changed
$( "input[name='video_src']" ).change(function() {
	try {
		vid.src = $( "input[name='video_src']" ).val(); 
	}
	catch (e) {
		alert('Video not found!')
	}
});


// update subtitles on input subtitles source changed
$( "input[name='video_subtitles']" ).change(function() {
	subtitles = $( "input[name='video_subtitles']" ).val();
	updateSubtitles();
});

// if video is playing, display subtitles on top of the video
window.setInterval(function(){
	if (isPlaying) {
		var currentTime = vid.currentTime;
		cues.map(function(cue) {
			if (currentTime.between(cue.startTime, cue.endTime)){
				cue.active = true;
			}
			else {
				cue.active = false;
			}
		});
		let subtitles = cues.filter(cue => {
			return cue.active == true;
		});
		if (subtitles.length > 0) {
			$( "p" ).text(subtitles[0].text);
		}
		else {
			$( "p" ).text('')
		}
	}
}, 10);

vid.onplaying = function () {
	isPlaying = true;
}

vid.onplay = function() {
	isPlaying = true;
}

vid.onpause = function() {
	isPlaying = false;
}

vid.onseeking = function() {
}

// update text tracks for track element
var updateTextTracks = function( bSubtitles ) {
	var textTracks = document.getElementById( 'videoMain' ).textTracks;
	if (textTracks.length < 1)
		return;
		
	textTracks[0].mode = (bSubtitles) ? 'showing' : 'disabled';
}

// if Subtitles is checked show track element with subtitles
$('#checkSubtitles').change(function() {
	updateTextTracks( $('#checkSubtitles').is(":checked") );
});

// update subtitles
function updateSubtitles() {
	// reset cues
	cues = [];
	jQuery.get(subtitles, function(data) {
		parseWebVTT(data);
	});
}

// convert timestamp to seconds
function timestampToSeconds(h, m, s, ms) {
      return (h | 0) * 3600 + (m | 0) * 60 + (s | 0) + (ms | 0) / 1000;
}

// get timestamp in seconds
function getTimestampSeconds(timestamp) {

    var timestamp_value = timestamp.match(/^(\d+):(\d{2})(:\d{2})?\.(\d{3})/);
    if (!timestamp_value) {
		return null;
    }

    if (timestamp_value[3]) {
		return timestampToSeconds(timestamp_value[1], timestamp_value[2], timestamp_value[3].replace(":", ""), timestamp_value[4]);
    } else if (timestamp_value[1] > 59) {
		return timestampToSeconds(timestamp_value[1], timestamp_value[2], 0,  timestamp_value[4]);
    } else {
		return timestampToSeconds(0, timestamp_value[1], timestamp_value[2], timestamp_value[4]);
    }
}

// parse webvtt data
function parseWebVTT(data) {

	//\uFEFF is always used to represent the BOM, regardless of UTF-8 or UTF-16 being used
	var WEBVTT = /^\uFEFF?WEBVTT(?: .*)?/;
	var COMMENT = /^NOTE($|[ \t])/;
	var TIMESTAMP = /\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}/;
	var TIMESTAMP_SEPARATOR = '-->'
	var empty_lines = /\r?\n\r?\n/g;
	var NEWLINE = /\r\n|\r|\n/
	var index = 0;
	
	var lines = data.split(NEWLINE);
	
	// skip WEBVTT declaration
	if (WEBVTT.test(lines[index])){
		index ++;
	}
	
	number_of_lines = lines.length;
	
    while(lines[index] != undefined) {
	
		// cue object
		var cue = {
			id: "",
			startTime: 0,
			endTime: 0,
			active: false,
			text: ""
		}
	
		
		// skip comments and undefined lines
		if (COMMENT.test(lines[index])) {

			while(lines[index] != "" && lines[index] != undefined) {
				if(lines[index].indexOf(TIMESTAMP_SEPARATOR) < 0) {
					throw 'Error in file'
				}
				index ++;
            }
            continue;
		}

		if (lines[index].indexOf(TIMESTAMP_SEPARATOR) < 0) {
              cue.id = lines[index];
			  index++;
		}	
		
		// parse lines 
		if (lines[index].indexOf(TIMESTAMP_SEPARATOR) >= 0) { 
			parsed_lines = lines[index].split(TIMESTAMP_SEPARATOR)
			cue.startTime =	getTimestampSeconds(parsed_lines[0].trim());
			cue.endTime = getTimestampSeconds(parsed_lines[1].trim());
			index++;
			while (lines[index] != '') {
				cue.text += lines[index];
				cue.text += '\n';
				index++;
			}
		}
		cues.push(cue)
		index++;
	}
			
}


// return true if number between a and b
Number.prototype.between = function(a, b) {
  var min = Math.min(a, b),
      max = Math.max(a, b);
  return this >= min && this <= max;
};
