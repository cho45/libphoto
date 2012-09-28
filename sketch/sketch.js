#!node

var libphoto = require('../lib/libphoto');

var models = [
	{
		name : 'Canon EOS 1D X',
		sensorSize : {
			width: 36,
			height: 24
		},

		pixels : {
			width: 5184,
			height: 3456
		}
	},
	{
		name : 'Canon EOS 5D Mark III',
		sensorSize : {
			width: 36,
			height: 24
		},

		pixels : {
			width: 5760,
			height: 3840
		}
	},
	{
		name : 'Canon EOS 5D Mark II',
		sensorSize : {
			width: 36,
			height: 24
		},

		pixels : {
			width: 5616,
			height: 3744
		}
	},
	{
		name : 'Canon EOS 6D',
		sensorSize : {
			width: 35.8,
			height: 23.9
		},

		pixels : {
			width: 5472,
			height: 3648
		}
	},
	{
		name : 'Canon EOS 7D',
		sensorSize : {
			width: 22.3,
			height: 14.9
		},

		pixels : {
			width: 5184,
			height: 3456
		}
	},
	{
		name : 'Canon EOS 60D',
		sensorSize : {
			width: 22.3,
			height: 14.9
		},

		pixels : {
			width: 5184,
			height: 3456
		}
	},
	{
		name : 'Canon EOS X6i',
		sensorSize : {
			width: 22.3,
			height: 14.9
		},

		pixels : {
			width: 5184,
			height: 3456
		}
	},
	{
		name : 'Canon EOS X5',
		sensorSize : {
			width: 22.3,
			height: 14.9
		},

		pixels : {
			width: 5184,
			height: 3456
		}
	},
	{
		name : 'Canon EOS X50',
		sensorSize : {
			width: 22.0,
			height: 14.7
		},

		pixels : {
			width: 4272,
			height: 2848
		}
	},
	{
		name : 'Canon EOS M',
		sensorSize : {
			width: 22.3,
			height: 14.9
		},

		pixels : {
			width: 5184,
			height: 3456
		}
	},
	{
		name : 'Nikon D4',
		sensorSize : {
			width: 36,
			height: 23.9
		},

		pixels : {
			width: 4928,
			height: 3280
		}
	},
	{
		name : 'Nikon D800',
		sensorSize : {
			width: 35.9,
			height: 24.0
		},

		pixels : {
			width: 7360,
			height: 4912
		}
	},
	{
		name : 'Nikon D600',
		sensorSize : {
			width: 35.9,
			height: 24.0
		},

		pixels : {
			width: 6016,
			height: 4016
		}
	},
	{
		name : 'Nikon D7000',
		sensorSize : {
			width: 23.6,
			height: 15.6
		},

		pixels : {
			width: 4928,
			height: 3264
		}
	},
	{
		name : 'Nikon D5100',
		sensorSize : {
			width: 23.6,
			height: 15.6
		},

		pixels : {
			width: 4928,
			height: 3264
		}
	},
	{
		name : 'Nikon D3200',
		sensorSize : {
			width: 23.2,
			height: 15.4
		},

		pixels : {
			width: 6016,
			height: 4000
		}
	},
	{
		name : 'Nikon D3100',
		sensorSize : {
			width: 23.1,
			height: 15.4
		},

		pixels : {
			width: 4608,
			height: 3072
		}
	}
];

for (var i = 0, it; (it = models[i]); i++) {
	models[ it.name ] = it;
}

// var model = models['Nikon D800'];
// var model = models['Canon EOS 7D'];
var model = models['Canon EOS 5D Mark II'];

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

var circle      = model.sensorSize.width / model.pixels.width;
var focalLength = 35;
var fNumber     = 8;
var distance    = 23.8875  * 1000;
console.log(circle);
console.log(libphoto.hyperfocalDistanceByCircle(focalLength, fNumber, (model.sensorSize.width / model.pixels.width)) / 1000, 'm');
var depthOfField = libphoto.depthOfField(distance, focalLength, fNumber, (model.sensorSize.width / model.pixels.width));
console.log(depthOfField.map(function (n) { return n / 1000 }), 'm');
console.log(depthOfField[0] - distance, depthOfField[1] - distance, 'mm');

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

