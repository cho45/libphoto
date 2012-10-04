
LibPhoto = {
	makers : [],
	models : {},
	init : function () {
		var self = this;
		$.ajax({
			url: "lib/models.json",
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

		$('form input, form select').change(function () {
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
		$('#spec-minimun-speed').text(~~factor + 'x' +  ' (1/' + ~~(speed) + 'sec 50mm)' );

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

		$('#minimunSpeedByFocalLengthMore [name=shutterSpeed-novice]').val(
			self.formatShutterSpeed(minimunSpeedByFocalLength(
				+$('#minimunSpeedByFocalLengthMore [name=focalLength]').val(),
				{
					sensorSize   : self.model.sensorSize,
					pixels       : self.model.pixels,
					jiggle_angle : minimunSpeedByFocalLength.JIGGLE_ANGLE.NOVICE
				}
			) * Math.max(
					(
						self.model.pixels.width /
						(+$('#minimunSpeedByFocalLengthMore [name=size]').val().split(/x/)[1] / 25.4)
					) /
					dpiByDistanceAndVisualAcuity(
						+$('#minimunSpeedByFocalLengthMore [name=distance]').val() * 10,
						+$('#minimunSpeedByFocalLengthMore [name=visualAcuity]').val()
					),
				1
			))
		);

		$('#minimunSpeedByFocalLengthMore [name=shutterSpeed-advanced]').val(
			self.formatShutterSpeed(minimunSpeedByFocalLength(
				+$('#minimunSpeedByFocalLengthMore [name=focalLength]').val(),
				{
					sensorSize   : self.model.sensorSize,
					pixels       : self.model.pixels,
					jiggle_angle : minimunSpeedByFocalLength.JIGGLE_ANGLE.ADVANCED
				}
			) * Math.max(
					(
						self.model.pixels.height /
						(+$('#minimunSpeedByFocalLengthMore [name=size]').val().split(/x/)[1] / 25.4)
					) /
					dpiByDistanceAndVisualAcuity(
						+$('#minimunSpeedByFocalLengthMore [name=distance]').val() * 10,
						+$('#minimunSpeedByFocalLengthMore [name=visualAcuity]').val()
					),
				1
			))
		);

		var focalLength = +$('#depthOfField [name=focalLength]').val();
		var fNumber     = +$('#depthOfField [name=fNumber]').val();
		var distance    = +$('#depthOfField [name=target]').val() * 10;
		var size        = +$('#depthOfField [name=size]').val().split(/x/)[1];
		var visualAcuity= +$('#depthOfField [name=size]').val().split(/x/)[1];
		var dpi = dpiByDistanceAndVisualAcuity(
			+$('#depthOfField [name=distance]').val() * 10,
			+$('#depthOfField [name=visualAcuity]').val()
		);
		var circle      = circleOfConfusion(size, dpi, self.model.sensorSize.width);
		var dof = depthOfField(distance, focalLength, fNumber, circle);
		$('#depthOfField [name=depthOfField]').val(~~(dof[1] - dof[0]));
		$('#depthOfField [name=depthOfField2]').val( ~~(dof[0] - distance) + ' +' + ~~(dof[1] - distance) );
	},

	formatShutterSpeed : function (speed) {
		if (speed > 1) return Math.round(speed) + '';
		return '1/' + Math.round(1 / speed);
	}
};

$(function () {
	LibPhoto.init();
});
