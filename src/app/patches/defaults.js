'use strict';

module.exports = {

	"Clean Sine": {
		daw: {
			pitch: {
				bend: {
					value: 0,
					range: [ -200, 200 ]
				}
			},
			modulation: {
				rate: {
					value: 0,
					range: [ 0, 15 ]
				}
			},
			delay: {
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
			reverb: {
				level: {
					value: 0,
					range: [ 0, 1 ]
				}
			},
			masterVolume: {
				level: {
					value: 0.8,
					range: [ 0, 1 ]
				}
			}
		},
		instruments: {
			"synth": {
				pitch: {
					bend: {
						value: 0,
						range: [ -200, 200 ]
					}
				},
				modulation: {
					waveform: {
						value: 0,
						range: [ 0, 5 ]
					},
					portamento: {
						value: 5 / 100 / 6,
						range: [ 0, 1/6 ]
					},
					rate: {
						value: 0,
						range: [ 0, 15 ]
					}
				},
				oscillator: {
					osc1: {
						range: {
							value: 0,
							range: [ -4, 2 ]
						},
						fineDetune: {
							value: 0,
							range: [ -8, 8 ]
						},
						waveform: {
							value: 0,
							range: [ 0, 5 ]
						}
					},
					osc2: {
						range: {
							value: 0,
							range: [ -4, 2 ]
						},
						fineDetune: {
							value: 0,
							range: [ -8, 8 ]
						},
						waveform: {
							value: 0,
							range: [ 0, 5 ]
						}
					},
					osc3: {
						range: {
							value: -1,
							range: [ -4, 2 ]
						},
						fineDetune: {
							value: 0,
							range: [ -8, 8 ]
						},
						waveform: {
							value: 0,
							range: [ 0, 5 ]
						}
					}
				},
				mixer: {
					volume1: {
						enabled: {
							value: 1,
							range: [ 0, 1 ]
						},
						level: {
							value: 0.6,
							range: [ 0, 1 ]
						}
					},
					volume2: {
						enabled: {
							value: 0,
							range: [ 0, 1 ]
						},
						level: {
							value: 0.6,
							range: [ 0, 1 ]
						}
					},
					volume3: {
						enabled: {
							value: 0,
							range: [ 0, 1 ]
						},
						level: {
							value: 0.6,
							range: [ 0, 1 ]
						}
					}
				},
				noise: {
					enabled: {
						value: 0,
						range: [ 0, 1 ]
					},
					type: {
						value: 0,
						range: [ 0, 2 ]
					},
					level: {
						value: 0.2,
						range: [ 0, 1 ]
					}
				},
				envelopes: {
					primary: {
						attack: {
							value: 0.5,
							range: [ 0, 2 ]
						},
						decay: {
							value: 0.5,
							range: [ 0.002, 2 ]
						},
						sustain: {
							value: 0.5,
							range: [ 0, 1 ]
						},
						release: {
							value: 0.1,
							range: [ 0, 2 ]
						}
					},
					filter: {
						attack: {
							value: 0.5,
							range: [ 0, 2 ]
						},
						decay: {
							value: 0.5,
							range: [ 0, 2 ]
						},
						sustain: {
							value: 0.5,
							range: [ 0.001, 1 ]
						},
						release: {
							value: 0.1,
							range: [ 0, 2 ]
						}
					}
				},
				filter: {
					cutoff: {
						value: 4000,
						range: [ 0, 8000 ]
					},
					emphasis: {
						value: 2,
						range: [ 0.4, 40 ]
					},
					envAmount: {
						value: 0,
						range: [ 0, 1 ]
					}
				},
				lfo: {
					waveform: {
						value: 0,
						range: [ 0, 5 ]
					},
					rate: {
						value: 3,
						range: [ 1, 25 ]
					},
					amount: {
						value: 0,
						range: [ 0, 1 ]
					}
				}
			}
		}
	},

	"Not so Clean Sine": {
		daw: {
			pitch: {
				bend: {
					value: 0,
					range: [ -200, 200 ]
				}
			},
			modulation: {
				rate: {
					value: 0,
					range: [ 0, 15 ]
				}
			},
			delay: {
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
			reverb: {
				level: {
					value: 0,
					range: [ 0, 1 ]
				}
			},
			masterVolume: {
				level: {
					value: 0.8,
					range: [ 0, 1 ]
				}
			}
		},
		instruments: {
			"synth": {
				pitch: {
					bend: {
						value: 0,
						range: [ -200, 200 ]
					}
				},
				modulation: {
					waveform: {
						value: 0,
						range: [ 0, 5 ]
					},
					portamento: {
						value: 5 / 100 / 6,
						range: [ 0, 1/6 ]
					},
					rate: {
						value: 0,
						range: [ 0, 15 ]
					}
				},
				oscillator: {
					osc1: {
						range: {
							value: 0,
							range: [ -4, 2 ]
						},
						fineDetune: {
							value: 0,
							range: [ -8, 8 ]
						},
						waveform: {
							value: 0,
							range: [ 0, 5 ]
						}
					},
					osc2: {
						range: {
							value: 0,
							range: [ -4, 2 ]
						},
						fineDetune: {
							value: -7,
							range: [ -8, 8 ]
						},
						waveform: {
							value: 0,
							range: [ 0, 5 ]
						}
					},
					osc3: {
						range: {
							value: -1,
							range: [ -4, 2 ]
						},
						fineDetune: {
							value: 0,
							range: [ -8, 8 ]
						},
						waveform: {
							value: 0,
							range: [ 0, 5 ]
						}
					}
				},
				mixer: {
					volume1: {
						enabled: {
							value: 1,
							range: [ 0, 1 ]
						},
						level: {
							value: 0.6,
							range: [ 0, 1 ]
						}
					},
					volume2: {
						enabled: {
							value: 1,
							range: [ 0, 1 ]
						},
						level: {
							value: 0.6,
							range: [ 0, 1 ]
						}
					},
					volume3: {
						enabled: {
							value: 0,
							range: [ 0, 1 ]
						},
						level: {
							value: 0.6,
							range: [ 0, 1 ]
						}
					}
				},
				noise: {
					enabled: {
						value: 0,
						range: [ 0, 1 ]
					},
					type: {
						value: 0,
						range: [ 0, 2 ]
					},
					level: {
						value: 0.2,
						range: [ 0, 1 ]
					}
				},
				envelopes: {
					primary: {
						attack: {
							value: 0.5,
							range: [ 0, 2 ]
						},
						decay: {
							value: 0.5,
							range: [ 0.002, 2 ]
						},
						sustain: {
							value: 0.5,
							range: [ 0, 1 ]
						},
						release: {
							value: 0.1,
							range: [ 0, 2 ]
						}
					},
					filter: {
						attack: {
							value: 0.5,
							range: [ 0, 2 ]
						},
						decay: {
							value: 0.5,
							range: [ 0, 2 ]
						},
						sustain: {
							value: 0.5,
							range: [ 0.001, 1 ]
						},
						release: {
							value: 0.1,
							range: [ 0, 2 ]
						}
					}
				},
				filter: {
					cutoff: {
						value: 4000,
						range: [ 0, 8000 ]
					},
					emphasis: {
						value: 2,
						range: [ 0.4, 40 ]
					},
					envAmount: {
						value: 0,
						range: [ 0, 1 ]
					}
				},
				lfo: {
					waveform: {
						value: 0,
						range: [ 0, 5 ]
					},
					rate: {
						value: 3,
						range: [ 1, 25 ]
					},
					amount: {
						value: 0,
						range: [ 0, 1 ]
					}
				}
			}
		}
	}

};