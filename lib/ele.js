
class ele {

    get style() { return this.target.style; }

    set background(b) { this.style.background = b; }
    set backgroundPosition(p) { this.style.backgroundPosition = p; }
    set backgroundSize(s) { this.style.backgroundSize = s; }
    set backgroundColor(c) { this.style.backgroundColor = c; }
    set bottom(b) { this.style.bottom = b; }

    set display(d) { this.style.display = d; }
    
    get height() { return this.target.clientHeight; }
    set height(h) { this.style.height = h; }
    
    set left(l) { this.style.left = l; }

    set position(p) { this.style.position = p; }
    
    set right(r) { this.style.right = r; }

    set top(t) { this.style.top = t; }

    get width() { return this.target.clientWidth; }
    set width(w) { this.style.width = w; }
    
    constructor(eleName) {
        this.target = document.createElement(eleName);
    }
}

class div extends ele {
    constructor() {
        super("div");
    }
}