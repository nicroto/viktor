'use strict';

module.exports = {

	DEFAULT_PITCH_SETTINGS: {
		bend: 0
	},
	DEFAULT_DELAY_SETTINGS: {
		time: 15,
		feedback: 30,
		dry: 100,
		wet: 0
	},
	DEFAULT_REVERB_SETTINGS: {
		level: 0
	},
	DEFAULT_MASTER_VOLUME_SETTINGS: {
		level: 80
	},

	TUNA_DELAY_DEFAULT_SETTINGS: {
		feedback: 0.45,
		delayTime: 150,
		wetLevel: 0.25,
		dryLevel: 1,
		cutoff: 2000,
		bypass: 0
	},
	TUNA_REVERB_DEFAULT_SETTINGS: {
		highCut: 22050,
		lowCut: 20,
		dryLevel: 1,
		wetLevel: 0,
		level: 1,
		impulse: "impulses/impulse_rev.wav",
		bypass: 0
	}

};