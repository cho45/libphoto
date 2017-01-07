


var app = new Vue({
	el: '#app',
	data: {
		models: [],
		model: null,
		cameraPreset: "",
		cameraName: "",
		sensorWidth: "35.0",
		sensorHeight: "24.0",
		sensorPixelWidth: 0,
		sensorPixelHeight: 0,

		showFloating: false,

		focalLength: 50,
		fNumber: 5.6,
		distance: 10
	},

	computed: {
		modelSelect : function () {
			var groupMap = {};
			var groups = [];
			for (var i = 0, it; (it = this.models[i]); i++) {
				var groupName = it.maker;
				if (it.sensorSize.width > 37) {
					groupName += " 中判以上";
				} else
				if (it.sensorSize.width > 34) {
					groupName += " フルサイズ";
				} else
				if (it.sensorSize.width > 27) {
					groupName += " APS-H";
				} else
				if (it.sensorSize.width > 22) {
					groupName += " APS-C";
				} else
				if (it.sensorSize.width > 17) {
					groupName += " フォーサーズ";
				}

				if (!groupMap[groupName]) {
					groupMap[groupName] = {
						name : groupName,
						models: []
					};
					groups.push(groupMap[groupName]);
				}
				groupMap[groupName].models.push(it);
			}
			console.log(groups);
			return groups;
		},

		sensorPixelSizeWidth : function () {
			return this.sensorWidth / this.sensorPixelWidth;
		},

		sensorPixelSizeHeight : function () {
			return this.sensorHeight / this.sensorPixelHeight;
		},

		minimunSpeedFactor : function () {
			return (1 / minimunSpeedByFocalLength(50, {
				sensorSize   : {
					width: this.sensorWidth,
					height: this.sensorHeight
				},
				pixels       : {
					width: this.sensorPixelWidth,
					height: this.sensorPixelHeight
				},
				jiggle_angle : minimunSpeedByFocalLength.JIGGLE_ANGLE.NOVICE
			})) / 50;
		},

		limitFNumber : function () {
			var lambda = 550;
			return Math.min(this.sensorPixelSizeWidth, this.sensorPixelSizeHeight) / (1.22 * 0.000001 * lambda);
		},

		hyperfocalDistance : function () {
			var circle = Math.max(this.sensorPixelSizeWidth, this.sensorPixelSizeHeight);
			circle = Math.max(circle, rayleighLimit(this.fNumber, 550));
			return hyperfocalDistanceByCircle(this.focalLength, this.fNumber, circle);
		},

		depthOfField : function () {
			var circle = Math.max(this.sensorPixelSizeWidth, this.sensorPixelSizeHeight);
			circle = Math.max(circle, rayleighLimit(this.fNumber, 550));
			return depthOfField(this.distance * 1000, this.focalLength, this.fNumber, circle);
		},

		searchParams : function () {
			var params = new URLSearchParams("");
			params.set('m', this.cameraName);
			params.set('sw', this.sensorWidth);
			params.set('sh', this.sensorHeight);
			params.set('pw', this.sensorPixelWidth);
			params.set('ph', this.sensorPixelHeight);
			params.set('fl', this.focalLength);
			params.set('F', this.fNumber);
			params.set('d', this.distance);
			return params.toString();
		}
	},

	methods: {
		linkToAmazon : function (search) {
			var url = 'https://www.amazon.co.jp/s/?_encoding=UTF8&camp=1207&creative=8415&linkCode=shr&tag=nuso-22&__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&url=search-alias=aps&field-keywords=%s';
			return url.replace('%s', encodeURIComponent(search));
		},

		shareLink : function (base, hash) {
			return base.replace('%u', encodeURIComponent(location.href + hash));
		}
	},

	watch: {
		cameraName : function (val) {
			this.model = this.models.find(function (i) {
				return i.name === val;
			});
			if (this.model) {
				this.sensorWidth  = this.model.sensorSize.width;
				this.sensorHeight = this.model.sensorSize.height;
				this.sensorPixelWidth  = this.model.pixels.width;
				this.sensorPixelHeight = this.model.pixels.height;
			}
		},

		cameraPreset: function (val) {
			console.log('preset', val);
			this.cameraName = val;
		}
	},

	created: function () {
		var self = this;
		var req = new XMLHttpRequest();
		req.open("GET", './lib/models.json', true);
		req.onload = function (e) {
			self.models = JSON.parse(req.responseText).map(function (i) {
				if (i.pixelCount) {
					var pixelCount = i.pixelCount;
					var aspectRatio = i.sensorSize.width/i.sensorSize.height;

					var width = Math.sqrt(pixelCount) * Math.sqrt(aspectRatio);
					var height = pixelCount / width;
					i.pixels = {
						width: Math.round(width),
						height: Math.round(height)
					};
				}
				return i;
			});
			if (!self.cameraPreset) {
				self.cameraPreset = self.models[0].name;
			}

			var params = new URLSearchParams(location.search.substring(1));
			if (params.has('m') && params.has('sw') && params.has('sh')) {
				var cameraName = params.get('m');
				var model = self.models.find(function (i) {
					return i.name === cameraName;
				});

				if (model) {
					self.cameraPreset = cameraName;
				} else {
					self.cameraPreset = "";
					self.cameraName = cameraName;
					self.sensorWidth = params.get('sw');
					self.sensorHeight = params.get('sh');
					self.sensorPixelWidth = params.get('pw');
					self.sensorPixelHeight = params.get('ph');
				}
				self.focalLength = params.get('fl');
				self.fNumber = params.get('F');
				self.distance = params.get('d');
			}
		};
		req.onerror = function (e) {
			alert(e);
		};
		req.send(null);

		document.addEventListener('scroll', _.debounce(function () {
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var rect = document.getElementById('result').getBoundingClientRect();
			var base = rect.top + rect.height + window.pageYOffset;

			if (scrollTop > base) {
				self.showFloating = true;
			} else {
				self.showFloating = false;
			}
		}));
	},

	updated: function (e) {
		history.replaceState(null, document.title, "?" + this.searchParams.toString());
	},

	destroyed: function () {
	},

	filters : {
		mm2um : function (mm) {
			return mm * 1000;
		},

		toFixed : function (v, n) {
			return Number(v).toFixed(n);
		}
	}
});

console.log(app);
