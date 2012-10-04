#!node

var libphoto = require('../lib/libphoto');

var models = JSON.parse(require('fs').readFileSync('./lib/models.json', 'utf-8'));

for (var i = 0, it; (it = models[i]); i++) {
	models[ it.name ] = it;
}

var model = models['EOS 5D Mark II'];

console.log('Pixels', model.pixels.width * model.pixels.height);
console.log('Density', model.pixels.width / model.sensorSize.width, model.pixels.height / model.sensorSize.height, 'pixels/mm');

var spatialFrequency = model.pixels.width / model.sensorSize.width / 2;
console.log('Spatial frequency', spatialFrequency, 'Hz(mm)');
var nyquistFrequency = spatialFrequency / 2;
console.log('Nyquist frequency', nyquistFrequency, 'Hz(mm)');

function show (f) {
	var speed = 1 / libphoto.minimunSpeedByFocalLength(f, model);
	console.log("%dmm 1/%dsec (スピード%d倍=%d段)",
		f,
		Math.floor(speed),
		~~(speed / f),
		Math.sqrt(speed / f).toFixed(2)
	);
}

show(24);
show(50);
show(100);
show(200);

var circle      = libphoto.circleOfConfusion(420, 300, model.sensorSize.width);
// var circle      = model.sensorSize.width / model.pixels.width;
var focalLength = 20;
var fNumber     = 8;
var distance    = 7000;
console.log(circle);
console.log(libphoto.hyperfocalDistanceByCircle(focalLength, fNumber, circle) / 1000, 'm');
var depthOfField = libphoto.depthOfField(distance, focalLength, fNumber, circle);
console.log(depthOfField.map(function (n) { return n / 1000 }), 'm');
console.log(depthOfField[0] - distance, depthOfField[1] - distance, 'mm');

console.log('=====');

var lowestDPI = libphoto.dpiByDistanceAndVisualAcuity(500, 1.5);
var size      = 483;
var maxDPI    = model.pixels.width / (size / 25.4);
console.log([lowestDPI, maxDPI, maxDPI / lowestDPI]);
console.log(1 / libphoto.minimunSpeedByFocalLength(50, model) / Math.max(maxDPI / lowestDPI, 1), 'sec');

/*
function a (n) {
	return Math.floor(
		1000 /
			(Math.pow(2, (2 * n - 1) / 4)) + 0.2
	);
}

function b (n) {
	return Math.floor(
		1000 /
			(Math.pow(2, (n - 1) / 2)) + 0.2
	);
}

var paperSize = [];
for (var i = 0; i < 11; i++) {
//	paperSize.push({
//		name : 'B' + i,
//		width : b(i),
//		height: b(i + 1) 
//	});
	paperSize.push({
		name : 'A' + i,
		width : a(i),
		height: a(i + 1) 
	});
	console.log('<option value="%s">%s</option>', a(i) + 'x' + a(i + 1), 'A' + i);
}

for (var i = 0, it; (it = paperSize[i]); i++) {
	paperSize[it.name] = it;
}

console.log(paperSize);
*/
/*


// 24mm の焦点距離で、1m 離れた距離にあるものが何mm収まるか
console.log(sizeByDistanceAndAngle(1000, angleOfView(36, 50)));

console.log('====');

// 30cm の距離で A4用紙を見る場合のパースに匹敵する焦点距離
console.log(~~angleToFocalLength(36, angleByDistanceAndSize(300, 297)));

// 50cm で A3
console.log(~~angleToFocalLength(36, angleByDistanceAndSize(500, 420)));

// 100cm で A3
console.log(~~angleToFocalLength(36, angleByDistanceAndSize(1000, 420)));

// 50cm で A3+
console.log(~~angleToFocalLength(36, angleByDistanceAndSize(300, 483)));

// 50cm A0
console.log(~~angleToFocalLength(36, angleByDistanceAndSize(500, 1189)));

console.log('====');

var pixels = {
	width: 5616,
	height: 3744
};

// 視力1.5の場合
var human = angularSubtenseByVisualAcuity(1.5);
// 30cm の距離で必要な印刷dpi
console.log( 25.4 / sizeByDistanceAndAngle(300, human) );
// 50cm の距離で必要な印刷dpi
console.log( 25.4 / sizeByDistanceAndAngle(500, human) );
// 100cm の距離で必要な印刷dpi
console.log( 25.4 / sizeByDistanceAndAngle(1000, human) );

console.log('====');

// 30cm の距離で必要な印刷dpi
console.log(dpiByDistanceAndVisualAcuity(300, 1.5));
// 50cm の距離で必要な印刷dpi
console.log(dpiByDistanceAndVisualAcuity(500, 1.5));
// 100cm の距離で必要な印刷dpi
console.log(dpiByDistanceAndVisualAcuity(1000, 1.5));

// 視力 1.0 の人が 50cm の距離で見たとき、ドットの見分けがつかない限りで最大の印刷サイズ
console.log(pixels.width / dpiByDistanceAndVisualAcuity(500, 1.0) * 25.4, 'mm');
// 視力 1.5 の人が 100cm の距離で見たとき、ドットの見分けがつかない限りで最大の印刷サイズ
console.log(pixels.width / dpiByDistanceAndVisualAcuity(1000, 1.5) * 25.4, 'mm');

// 視力 1.5 の人について、最大限画質を考慮して拡大しつつパースが正しくなる最小の焦点距離
// 1000mm の位置を仮定してるが、これは距離が変わっても一緒
console.log(~~angleToFocalLength(36, angleByDistanceAndSize(1000, pixels.width / dpiByDistanceAndVisualAcuity(1000, 1.5) * 25.4)), 'mm');
// 視力 1.0
console.log(~~angleToFocalLength(36, angleByDistanceAndSize(1000, pixels.width / dpiByDistanceAndVisualAcuity(1000, 1.0) * 25.4)), 'mm');


console.log(~~angleToFocalLength(36, lowerFocalDistanceByPixelAndVisualAcuity(pixels.width, 2.0) ));
console.log(~~angleToFocalLength(36, lowerFocalDistanceByPixelAndVisualAcuity(pixels.width, 1.5) ));
console.log(~~angleToFocalLength(36, lowerFocalDistanceByPixelAndVisualAcuity(pixels.width, 1.0) ));


// モニタの場合はどうすればいいか?
//   サイズが可変・ドットは固定
// 画像をFFTして空間周波数を分析したらどうなるか? (大きい変化・小さい変化の割合は?)

*/

