var items = [];
var windowWidth;
var windowHeight;
var run;

function onload() {
    InitItems();
    OnResize(null);
    run = true;
    render();
}

function InitItems() {
    for (var i = 0; i < 500; i++) {
        var d = new Item(RandBetween(10, 25) + "px");
        d.backgroundColor = RandomColor();
        //d.background = "url(https://c7.uihere.com/files/945/979/652/spacecraft-icon-spaceship-transparent-background.jpg)";
        //d.backgroundPosition = "center";
        //d.backgroundSize = "cover";
        d.xvel = RandBetween(1, 10);
        d.yvel = RandBetween(1, 10);
        document.body.append(d.target);
        items.push(d);
    }
}

function render() {
    items.forEach(item => item.move());
    items.forEach(item => item.render());

    if (run) {
        requestAnimationFrame(render);
    }
}

addEventListener("resize", OnResize);

function OnResize(e) {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
}

addEventListener("keydown", OnKeyDown);

function OnKeyDown(e) {
    run = !run;
    if (run) {
        render();
    }
}

class Item extends div {
    constructor(width) {
        super();
        this.width = width;
        this.height = width;
        this.position = "absolute";
        
        this.x = 0;
        this.y = 0;
        this.xvel = 0;
        this.yvel = 0;
        this.angle = 0;
        this.angularVel = 0;
        this.angleMultiplier = 2;

        var self = this;
        this.target.addEventListener("mousedown", e => self.MouseDown(e));
    }

    move() {
        var newX = this.x + this.xvel;
        var newY = this.y + this.yvel;
        var newRight = newX + this.width;
        var newBottom = newY + this.width;
        
        // bottom
        if (newBottom > windowHeight) {
            newBottom = windowHeight - (newBottom - windowHeight);
            this.y = newBottom - this.width;
            this.yvel *= -1;

            this.angularVel = this.xvel * this.angleMultiplier;
        }
        // top
        else if (newY < 0) {
            this.y = newY *= -1;
            this.yvel *= -1;

            this.angularVel = -this.xvel * this.angleMultiplier;
        }
        else {
            this.y = newY;
        }

        // right
        if (newRight > windowWidth) {
            newRight = windowWidth - (newRight - windowWidth);
            this.x = newRight - this.width;
            this.xvel *= -1;

            this.angularVel = -this.yvel * this.angleMultiplier;
        }
        // left
        else if (newX < 0) {
            this.x = newX *= -1;
            this.xvel *= -1;

            this.angularVel = this.yvel * this.angleMultiplier;
        }
        else {
            this.x = newX;
        }

        this.xvel *= 0.9999;
        this.yvel *= 0.9999;
        this.angularVel *= 0.9999;

        this.angle += this.angularVel;
    }

    // It is important to separate calculating the next state (i.e. move()) from
    // applying the new state (render()). If we apply the new state in move then
    // we get layout thrashing and performance is very poor when we get more than
    // a couple hundred items.
    render() {
        this.target.style.left = this.x + "px";
        this.target.style.top = this.y + "px";
        this.target.style.transform = "rotate(" + this.angle + "deg)";
    }

    MouseDown(e) {
        e.stopPropagation();
        e.preventDefault();
        this.xvel = 0;
        this.yvel = 0;
        this.angularVel = 0;

        this.downX = e.screenX;
        this.downY = e.screenY;
        this.mouseUpHandler = e => this.MouseUp(e);
        window.addEventListener("mouseup", this.mouseUpHandler);
    }

    MouseUp(e) {
        var deltaX = e.screenX - this.downX;
        var deltaY = e.screenY - this.downY;

        this.xvel = deltaX * 0.1;
        this.yvel = deltaY * 0.1;

        window.removeEventListener("mouseup", this.mouseUpHandler);
    }
}