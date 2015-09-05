'use strict';

exports.defaultLibrary = {

	"Default Patch": {
		"daw": {
			"pitch": {
				"bend": {
					"value": 0,
					"range": [-200, 200]
				}
			},
			"modulation": {
				"rate": {
					"value": 0,
					"range": [0, 15]
				}
			},
			"delay": {
				"time": {
					"value": 570,
					"range": [0, 1000]
				},
				"feedback": {
					"value": 0.45,
					"range": [0, 0.9]
				},
				"dry": {
					"value": 1,
					"range": [0, 1]
				},
				"wet": {
					"value": 0,
					"range": [0, 1]
				}
			},
			"reverb": {
				"level": {
					"value": 0.36,
					"range": [0, 1]
				}
			},
			"masterVolume": {
				"level": {
					"value": 0.8,
					"range": [0, 1]
				}
			}
		},
		"instruments": {
			"synth": {
				"modulation": {
					"waveform": {
						"value": 0,
						"range": [0, 5]
					},
					"portamento": {
						"value": 0.006666666666666666,
						"range": [0, 0.16666666666666666]
					},
					"rate": {
						"value": 0,
						"range": [0, 15]
					}
				},
				"oscillator": {
					"osc1": {
						"range": {
							"value": -1,
							"range": [-4, 2]
						},
						"fineDetune": {
							"value": 0,
							"range": [-8, 8]
						},
						"waveform": {
							"value": 2,
							"range": [0, 5]
						}
					},
					"osc2": {
						"range": {
							"value": -2,
							"range": [-4, 2]
						},
						"fineDetune": {
							"value": 0,
							"range": [-8, 8]
						},
						"waveform": {
							"value": 2,
							"range": [0, 5]
						}
					},
					"osc3": {
						"range": {
							"value": -3,
							"range": [-4, 2]
						},
						"fineDetune": {
							"value": 0,
							"range": [-8, 8]
						},
						"waveform": {
							"value": 3,
							"range": [0, 5]
						}
					}
				},
				"mixer": {
					"volume1": {
						"enabled": {
							"value": 0,
							"range": [0, 1]
						},
						"level": {
							"value": 0.2,
							"range": [0, 1]
						}
					},
					"volume2": {
						"enabled": {
							"value": 1,
							"range": [0, 1]
						},
						"level": {
							"value": 0.16,
							"range": [0, 1]
						}
					},
					"volume3": {
						"enabled": {
							"value": 1,
							"range": [0, 1]
						},
						"level": {
							"value": 0.08,
							"range": [0, 1]
						}
					}
				},
				"noise": {
					"enabled": {
						"value": 0,
						"range": [0, 1]
					},
					"level": {
						"value": 0.17,
						"range": [0, 1]
					},
					"type": {
						"value": 0,
						"range": [0, 2]
					}
				},
				"envelopes": {
					"primary": {
						"attack": {
							"value": 0,
							"range": [0, 2]
						},
						"decay": {
							"value": 0.002,
							"range": [0.002, 2]
						},
						"sustain": {
							"value": 1,
							"range": [0, 1]
						},
						"release": {
							"value": 0.02,
							"range": [0, 2]
						}
					},
					"filter": {
						"attack": {
							"value": 2,
							"range": [0, 2]
						},
						"decay": {
							"value": 1.44,
							"range": [0, 2]
						},
						"sustain": {
							"value": 0.001,
							"range": [0.001, 1]
						},
						"release": {
							"value": 0.02,
							"range": [0, 2]
						}
					}
				},
				"filter": {
					"cutoff": {
						"value": 2048,
						"range": [0, 8000]
					},
					"emphasis": {
						"value": 1.6,
						"range": [0.4, 40]
					},
					"envAmount": {
						"value": 0.36,
						"range": [0, 1]
					}
				},
				"lfo": {
					"waveform": {
						"value": 0,
						"range": [0, 5]
					},
					"rate": {
						"value": 6,
						"range": [1, 25]
					},
					"amount": {
						"value": 0,
						"range": [0, 1]
					}
				},
				"pitch": {
					"bend": {
						"value": 0,
						"range": [-200, 200]
					}
				}
			}
		}
	}

};

exports.customLibrary = {

	"Custom Patch": {
		"daw": {
			"pitch": {
				"bend": {
					"value": 0,
					"range": [-200, 200]
				}
			},
			"modulation": {
				"rate": {
					"value": 0,
					"range": [0, 15]
				}
			},
			"delay": {
				"time": {
					"value": 570,
					"range": [0, 1000]
				},
				"feedback": {
					"value": 0.45,
					"range": [0, 0.9]
				},
				"dry": {
					"value": 1,
					"range": [0, 1]
				},
				"wet": {
					"value": 0,
					"range": [0, 1]
				}
			},
			"reverb": {
				"level": {
					"value": 0.15,
					"range": [0, 1]
				}
			},
			"masterVolume": {
				"level": {
					"value": 0.8,
					"range": [0, 1]
				}
			}
		},
		"instruments": {
			"synth": {
				"modulation": {
					"waveform": {
						"value": 0,
						"range": [0, 5]
					},
					"portamento": {
						"value": 0.006666666666666666,
						"range": [0, 0.16666666666666666]
					},
					"rate": {
						"value": 0,
						"range": [0, 15]
					}
				},
				"oscillator": {
					"osc1": {
						"range": {
							"value": -1,
							"range": [-4, 2]
						},
						"fineDetune": {
							"value": 0,
							"range": [-8, 8]
						},
						"waveform": {
							"value": 0,
							"range": [0, 5]
						}
					},
					"osc2": {
						"range": {
							"value": -2,
							"range": [-4, 2]
						},
						"fineDetune": {
							"value": 0,
							"range": [-8, 8]
						},
						"waveform": {
							"value": 0,
							"range": [0, 5]
						}
					},
					"osc3": {
						"range": {
							"value": -3,
							"range": [-4, 2]
						},
						"fineDetune": {
							"value": 0,
							"range": [-8, 8]
						},
						"waveform": {
							"value": 0,
							"range": [0, 5]
						}
					}
				},
				"mixer": {
					"volume1": {
						"enabled": {
							"value": 1,
							"range": [0, 1]
						},
						"level": {
							"value": 0.2,
							"range": [0, 1]
						}
					},
					"volume2": {
						"enabled": {
							"value": 1,
							"range": [0, 1]
						},
						"level": {
							"value": 0.25,
							"range": [0, 1]
						}
					},
					"volume3": {
						"enabled": {
							"value": 1,
							"range": [0, 1]
						},
						"level": {
							"value": 0.55,
							"range": [0, 1]
						}
					}
				},
				"noise": {
					"enabled": {
						"value": 0,
						"range": [0, 1]
					},
					"level": {
						"value": 0.17,
						"range": [0, 1]
					},
					"type": {
						"value": 0,
						"range": [0, 2]
					}
				},
				"envelopes": {
					"primary": {
						"attack": {
							"value": 0,
							"range": [0, 2]
						},
						"decay": {
							"value": 0.002,
							"range": [0.002, 2]
						},
						"sustain": {
							"value": 0.73,
							"range": [0, 1]
						},
						"release": {
							"value": 0.02,
							"range": [0, 2]
						}
					},
					"filter": {
						"attack": {
							"value": 0.14,
							"range": [0, 2]
						},
						"decay": {
							"value": 0.2,
							"range": [0, 2]
						},
						"sustain": {
							"value": 0.16084,
							"range": [0.001, 1]
						},
						"release": {
							"value": 0.48,
							"range": [0, 2]
						}
					}
				},
				"filter": {
					"cutoff": {
						"value": 560,
						"range": [0, 8000]
					},
					"emphasis": {
						"value": 8.4,
						"range": [0.4, 40]
					},
					"envAmount": {
						"value": 0,
						"range": [0, 1]
					}
				},
				"lfo": {
					"waveform": {
						"value": 0,
						"range": [0, 5]
					},
					"rate": {
						"value": 6,
						"range": [1, 25]
					},
					"amount": {
						"value": 0,
						"range": [0, 1]
					}
				},
				"pitch": {
					"bend": {
						"value": 0,
						"range": [-200, 200]
					}
				}
			}
		}
	}

};