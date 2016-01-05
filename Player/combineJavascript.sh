cat Decoder.js WebGLCanvas.js Player.js stream.js mp4.js > broadwayPlayer.js

uglifyjs --compress -- Decoder.js WebGLCanvas.js Player.js stream.js mp4.js > broadwayPlayer-min.js
