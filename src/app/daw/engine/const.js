'use strict';

module.exports = {

	DEFAULT_PITCH_SETTINGS: {
		bend: {
			value: 0,
			range: [ -200, 200 ]
		}
	},
	DEFAULT_MODULATION_SETTINGS: {
		rate: {
			value: 0,
			range: [ 0, 15 ]
		}
	},
	DEFAULT_DELAY_SETTINGS: {
		time: {
			value: 150,
			range: [ 0, 1000 ]
		},
		feedback: {
			value: 0.3,
			range: [ 0, 0.9 ]
		},
		dry: {
			value: 1,
			range: [ 0, 1 ]
		},
		wet: {
			value: 0,
			range: [ 0, 1 ]
		}
	},
	DEFAULT_REVERB_SETTINGS: {
		level: {
			value: 0,
			range: [ 0, 1 ]
		}
	},
	DEFAULT_MASTER_VOLUME_SETTINGS: {
		level: {
			value: 0.8,
			range: [ 0, 1 ]
		}
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