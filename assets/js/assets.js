

$(function () {
	$.ajax({
		url: "/lib/models.json",
		type : "GET",
		data : {},
		dataType: 'json',
		success : function (data, status, xhr) {
			var makers = [];
			var models = {};

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
					var model = models[$(this).val()];
					var spatialFrequency = model.pixels.width / model.sensorSize.width / 2;
					var nyquistFrequency = spatialFrequency / 2;

					$('#spec-sensor').text(model.sensorSize.width + 'mm × ' + model.sensorSize.height + 'mm');
					$('#spec-pixels').text(model.pixels.width + ' × ' + model.pixels.height);
					$('#spec-nyquist-frequency').text(~~nyquistFrequency + 'Hz/mm');

					var speed  = 1 / minimunSpeedByFocalLength(50, model);
					var factor = speed / 50;
					$('#spec-minimun-speed').text( '1/' + ~~(speed) + 'sec = ' + ~~factor + 'x (50mm)' );
				}).
				insertBefore('#models').change();
		},
		complete : function (xhr, status) {
		}
	});
});
