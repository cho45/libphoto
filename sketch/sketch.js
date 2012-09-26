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
	}
];

for (var i = 0, it; (it = models[i]); i++) {
	models[ it.name ] = it;
}

var model = models['Canon EOS M'];

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

