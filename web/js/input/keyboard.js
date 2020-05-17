/**
 * Keyboard controls.
 *
 * @version 1
 */
const keyboard = (() => {

    let isKeysFilteredMode = true;

    const defaultMap = Object.freeze({
        37: KEY.LEFT,
        38: KEY.UP,
        39: KEY.RIGHT,
        40: KEY.DOWN,
        90: KEY.A, // z
        88: KEY.B, // x
        67: KEY.X, // c
        86: KEY.Y, // v
        65: KEY.L, // a
        83: KEY.R, // s
        13: KEY.START, // enter
        16: KEY.SELECT, // shift
        // non-game
        81: KEY.QUIT, // q
        87: KEY.JOIN, // w
        75: KEY.SAVE, // k
        76: KEY.LOAD, // l
        49: KEY.PAD1, // 1
        50: KEY.PAD2, // 2
        51: KEY.PAD3, // 3
        52: KEY.PAD4, // 4
        70: KEY.FULL, // f
        72: KEY.HELP, // h
        220: KEY.STATS, // \
        57: KEY.SETTINGS // 9
    });

    const settingsKey = opts.INPUT_KEYBOARD_MAP;
    let keyMap = {};

    const remap = (map = {}) => {
        settings.set(settingsKey, map);
        log.info('Keyboard keys have been remapped')
    }

    const onKey = (code, callback) => !keyMap[code] || callback(keyMap[code]);

    event.sub(KEYBOARD_TOGGLE_FILTER_MODE, data => {
        isKeysFilteredMode = data.mode !== undefined ? data.mode : !isKeysFilteredMode;
        log.debug(`New keyboard filter mode: ${isKeysFilteredMode}`);
    });

    return {
        init: () => {
            keyMap = settings.loadOr(settingsKey, defaultMap);
            const body = document.body;
            body.addEventListener('keyup', e => {
                if (isKeysFilteredMode) {
                    onKey(e.keyCode, key => event.pub(KEY_RELEASED, {key: key}));
                } else {
                    event.pub(KEY_RELEASED, {key: e.keyCode});
                }
            });
            body.addEventListener('keydown', e => onKey(e.keyCode, key => event.pub(KEY_PRESSED, {key: key})));
            log.info('[input] keyboard has been initialized');
        },
        settings: {
            remap
        }
    }
})
(event, document, KEY, log, opts, settings);
