# webvtt
Simple webvtt parser

## Run
* The application uses Express/Node as a web server <br/>
* Install node and npm <br/>
node version: v8.10.0 <br/>
npm version: 5.6.0 <br/>

**Go to application folder** <br/>
* Run npm install <br/>
* Run node app.js <br/>
* Load http://localhost:3000/ in a browser to see the output.<br/>

## Use case
* The first input textbox contains the url of the video file.<br/>
You can change the url and press enter to load another video file.<br/>
The default video is Sintel.<br/>
* The first input textbox contains the url of the file containing the captions.<br/>
You can change the url and press enter to load another captions file.<br/>
The default captions is in English for Sintel.<br/>
* The active cues are displayed on top of the video element.<br/>
* Check subtitles also shows the subtitles by using the track video element.<br/>
