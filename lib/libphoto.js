
function radiansToDegree (radian) {
	return radian * (180 / Math.PI);
}

function degreeToRadians (degree) {
	return degree * (Math.PI / 180);
}

// `size` (mm) サイズの素子で、焦点距離が `f` (mm) のときの画角 (radian)
function angleOfView (size, f) {
	return 2 * Math.atan(size / (2 * f));
}

// `size` (mm) サイズの素子で、画角が `angle` (radian) のときの焦点距離 (mm)
function angleToFocalLength (size, angle) {
	var a = Math.tan(angle / 2);
	return size / a / 2;
}

// `distance` (mm) 離れた距離にある `size` (mm) のものをピッタリ収めるのに必要な画角 (radian)
function angleByDistanceAndSize (distance, size) {
	var half = size / 2;
	return Math.atan(half / distance) * 2;
}

// `distance` (mm) 離れた距離において `angle` (radian) の画角でどれだけの大きさまで入るか (mm)
function sizeByDistanceAndAngle (distance, angle) {
	return Math.tan(angle / 2) * (2 * distance);
}

// 視力が `visualAcuity` のとき、見分けられる最小の角度 (radian)
// 視力の定義: 分単位で表した視角の逆数
// 視力 1.0 は 1.45444... 幅を5mの位置から見て識別できること
// console.log( 1 / (radiansToDegree(angleByDistanceAndSize(5000, 1.454444)) * 60), angleByDistanceAndSize(5000, 1.454444) );
// console.log( 1 / (radiansToDegree(angleByDistanceAndSize(10000, 1.454444)) * 60), angleByDistanceAndSize(10000, 1.454444) );
function angularSubtenseByVisualAcuity (visualAcuity) {
	if (!visualAcuity) visualAcuity = 1;
	return angleByDistanceAndSize(5000, 1.454444) / visualAcuity;
}

// `visualAcuity` の視力を持つ人について、`distance` (mm) 離れた距離にある印刷物に求められる最低の dpi
function dpiByDistanceAndVisualAcuity (distance, visualAcuity) {
	return 25.4 / sizeByDistanceAndAngle(distance, angularSubtenseByVisualAcuity(visualAcuity));
}

// `visualAcuity` の視力を持つ人について、`pixel` 個の画素があった場合最大限画質を考慮して拡大しつつパースが正しくなる最小の焦点距離 (mm)
// console.log(~~angleToFocalLength(36, angleByDistanceAndSize(1000, pixels.width / dpiByDistanceAndVisualAcuity(1000, 1.5) * 25.4)), 'mm');
function lowerFocalDistanceByPixelAndVisualAcuity (pixel, visualAcuity) {
	return Math.atan(
		( pixel / 
			(1 /
				( Math.tan(angularSubtenseByVisualAcuity(visualAcuity) / 2) )
			)
		)
	) * 2;
}

/**
 * `focalLength`mm の焦点距離のとき 1px 以内に手ぶれが収まる最低限のシャッタースピード
 * `opts.sensorSize.width`: センササイズ (横)
 * `opts.pixels.width`: ピクセル数 (横)
 * `opts.jiggle_angle`: 手ぶれの角速度 (角度/秒)
 *
 * (focalLength * Math.tan(degreeToRadians(2) * speed)) / (opts.sensorSize.width / opts.pixels.width) == 1;
 * focalLength * Math.tan(degreeToRadians(2) * speed) == (opts.sensorSize.width / opts.pixels.width);
 * Math.tan(degreeToRadians(2) * speed) == (opts.sensorSize.width / opts.pixels.width) / focalLength;
 * degreeToRadians(2) * speed == Math.atan( (opts.sensorSize.width / opts.pixels.width) / focalLength );
 * speed == Math.atan( (opts.sensorSize.width / opts.pixels.width) / focalLength ) / degreeToRadians(2);
 */
function minimunSpeedByFocalLength (focalLength, opts) {
	if (!opts) opts = {};
	if (!opts.jiggle_angle) opts.jiggle_angle = minimunSpeedByFocalLength.JIGGLE_ANGLE.ADVANCED;
	return Math.atan( (opts.sensorSize.width / opts.pixels.width) / focalLength ) / degreeToRadians(opts.jiggle_angle);
}
minimunSpeedByFocalLength.JIGGLE_ANGLE = { // 手ぶれ限界 角速度(角度/秒)
	NOVICE   : 5,
	ADVANCED : 2
};

/**
 * 焦点距離 `focalLength`, F値 `fNumber`, 許容錯乱円の直径 `circle` から過焦点距離を求める
 * (無限遠が被写界深度のぎりぎりに入るような距離)
 */
function hyperfocalDistanceByCircle (focalLength, fNumber, circle) {
	return (focalLength * focalLength) / (fNumber * circle);
}

/**
 * 被写界深度の前後の距離
 */
function depthOfField (distance, focalLength, fNumber, circle) {
	var hyperfocalDistance = hyperfocalDistanceByCircle(focalLength, fNumber, circle);
	var distance1 = (distance * (hyperfocalDistance - focalLength)) / (hyperfocalDistance + distance - (2 * focalLength));
	var distance2 = (distance * (hyperfocalDistance - focalLength)) / (hyperfocalDistance - distance);
	return [ distance1, distance2 > 0 ? distance2 : (1/0)];
}

this.angleOfView = angleOfView;
this.angleToFocalLength = angleToFocalLength;
this.angleByDistanceAndSize = angleByDistanceAndSize;
this.sizeByDistanceAndAngle = sizeByDistanceAndAngle;
this.angularSubtenseByVisualAcuity = angularSubtenseByVisualAcuity;
this.dpiByDistanceAndVisualAcuity = dpiByDistanceAndVisualAcuity;
this.lowerFocalDistanceByPixelAndVisualAcuity = lowerFocalDistanceByPixelAndVisualAcuity;
this.minimunSpeedByFocalLength = minimunSpeedByFocalLength;
this.hyperfocalDistanceByCircle = hyperfocalDistanceByCircle;
this.depthOfField = depthOfField;
