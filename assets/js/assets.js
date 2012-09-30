
LibPhoto = {
	makers : [],
	models : {},
	init : function () {
		var self = this;
		$.ajax({
			url: "/lib/models.json",
			type : "GET",
			data : {},
			dataType: 'json',
			success : function (data, status, xhr) {
				var makers = self.makers;
				var models = self.models;

				for (var i = 0, it; (it = data[i]); i++) {
					models[it.name] = it;
					if (makers[it.maker]) {
						makers[it.maker].models.push(it);
					} else {
						makers.push(makers[it.maker] = {
							name   : it.maker,
							models : []
						});
					}
				}

				$(template('models', { makers : makers })).
					change(function () {
						self.setModel($(this).val());
						self.calculate();
					}).
					insertBefore('#models').change();
			},
			complete : function (xhr, status) {
			}
		});

		$('form input').change(function () {
			self.calculate();
		});
	},

	setModel : function (name) {
		var self = this;
		var model = self.models[name];
		var spatialFrequency = model.pixels.width / model.sensorSize.width / 2;
		var nyquistFrequency = spatialFrequency / 2;

		$('#spec-sensor').text(model.sensorSize.width + 'mm x ' + model.sensorSize.height + 'mm');
		$('#spec-pixels').text(model.pixels.width + ' x ' + model.pixels.height);
		$('#spec-nyquist-frequency').text(~~nyquistFrequency + 'Hz/mm');

		var speed  = 1 / minimunSpeedByFocalLength(50, model);
		var factor = speed / 50;
		$('#spec-minimun-speed').text( '1/' + ~~(speed) + 'sec = ' + ~~factor + 'x (50mm)' );

		self.model = model;
	},

	calculate : function () {
		var self = this;
		$('#dpiByDistanceAndVisualAcuity [name=dpi]').val(Math.round(
			dpiByDistanceAndVisualAcuity(
				+$('#dpiByDistanceAndVisualAcuity [name=distance]').val() * 10,
				+$('#dpiByDistanceAndVisualAcuity [name=visualAcuity]').val()
			)
		));

		$('#minimunSpeedByFocalLength [name=shutterSpeed-novice]').val(
			self.formatShutterSpeed(minimunSpeedByFocalLength(
				+$('#minimunSpeedByFocalLength [name=focalLength]').val(),
				{
					sensorSize   : self.model.sensorSize,
					pixels       : self.model.pixels,
					jiggle_angle : minimunSpeedByFocalLength.JIGGLE_ANGLE.NOVICE
				}
			))
		);
		
		$('#minimunSpeedByFocalLength [name=shutterSpeed-advanced]').val(
			self.formatShutterSpeed(minimunSpeedByFocalLength(
				+$('#minimunSpeedByFocalLength [name=focalLength]').val(),
				{
					sensorSize   : self.model.sensorSize,
					pixels       : self.model.pixels,
					jiggle_angle : minimunSpeedByFocalLength.JIGGLE_ANGLE.ADVANCED
				}
			))
		);
	},

	formatShutterSpeed : function (speed) {
		if (speed > 1) return Math.round(speed) + '';
		return '1/' + Math.round(1 / speed);
	}
};

$(function () {
	LibPhoto.init();
});
