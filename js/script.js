const _scroller = function() {
    return {
        speed: 10,
        position: 0,
        width: 0,
        step: 0,
        t: null,
        window: 0,
        init: function() {      // slider initialization
            let el;
            // get inner width of slider
            el = document.getElementById('scroller_rule');
            _scroller.width = el.clientWidth;
            // get window width of the slider
            el = document.getElementById('scroller_window');
            _scroller.window = el.clientWidth;

            // set handler for mouse wheel
            addEvent(el, 'mousewheel', this.wheel);
            addEvent(el, 'DOMMouseScroll', this.wheel);

            // sizes fix for background(Opera, Chrome)
            el = getElementById('scroller_row');
            el.style.width = _scroller.width + 'px';
        },
        // mouse wheel handler
        wheel: function(e) {
            // if scrolling - ignore event
            if(_scroller.t != 0) {
                _scroller.stop();
            }
            // e = e ? e : this.window.event;
            e = e ? e : window.event;
            const wheelElem = e.target ? e.target : e.srcElement;
            const wheelData = e.detail ? e.detail*-1 : e.wheelData/40;
            // for Webkit returns wheelData * 100
            if(Math.abs(wheelData) > 100) {
                wheelData = Math.round(wheelData/100);
            }
            if(wheelData < 0) {
                _scroller.step = Math.abs(wheelData) * 5;
                _scroller.timer('right', 1);
            } else {
                _scroller.step = Math.abs(wheelData) * 5;
                _scroller.timer('left', 1);
            }
            // if(this.window.event)
            if(window.event) {
                e.canselBubble = true;
                e.returnValue = false;
                e.cansel = true;
            }
            if(e.stopPropagation && e.preventDefault) {
                e.stopPropagation();
                e.preventDefault();
            }
            return false;
        },
        // scroller function
        scroll: function(dir, wheel) {
            const el = document.getElementById('scroller_row');
            let step;
            if(wheel == 0) {
                step = 2;
            } else {
                step = Math.round(Math.log(_scroller.step * 2) * 2.5);
                _scroller.step--;

                if(_scroller.step == 0) {
                    _scroller.stop();
                }
            }
            if(dir == 'left') {
                _scroller.position += step;
                if(_scroller.position > 0) {
                    _scroller.position = 0;
                    _scroller.stop();
                }
            } else {
                // dir == 'right'
                _scroller.position -= step;
                if(_scroller.position < (_scroller.window - _scroller.width)) {
                    _scroller.position = _scroller.window - _scroller.width;
                    _scroller.stop();
                }
            }
            el.style.left = _scroller.position + 'px';
        },
        // slider timer
        timer: function(dir, wheel) {
            _scroller.stop();
            _scroller.t = setInterval("_scroller.scroll('"+ dir +"', "+ wheel +");", _scroller.speed);
        },
        // slider stop
        stop: function() {
            if(_scroller.t != null) {
                clearInterval(_scroller.t);
                _scroller.t = null;
            }
        },
    };
} ();

window.onload = function() {
    setTimeout(_scroller.init, 100);
};