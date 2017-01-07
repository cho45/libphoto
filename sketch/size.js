#!node

var libphoto = require('../lib/libphoto');

function displaySize (diagonal, width, height) {
	var r = Math.sqrt(Math.pow(diagonal, 2) / (Math.pow(width, 2) + Math.pow(height, 2)) ); 
	return { width: width * r, height: height * r };
}

var inch = 4;
var size = displaySize(inch * 25.4, 16, 9);
console.log('%dmm x %dmm', ~~size.width, ~~size.height);

// シンボルの認識限界とされる画角 ( http://gc.sfc.keio.ac.jp/class/2005_22267/slides/04/11.html )
var angleOfView = 30 * Math.PI / 180;

// ディスプレイサイズの横幅が上記画角になるときの距離
var distance = libphoto.angleToFocalLength(size.width, angleOfView);
console.log(Math.round(distance), 'mm');

// 視力1.5 の人がぎりぎりピクセルを区別できる程度のディスプレイ解像度
var ppi = libphoto.dpiByDistanceAndVisualAcuity(distance, 1.5);
console.log(Math.round(ppi), 'ppi');
