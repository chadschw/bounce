
var center;
var b;

var items;
var windowWidth;
var windowHeight;
var run;

var velocityMultiplier = 0.001;

function onload() {
    center = new Item("20px");
    center.backgroundColor = "red";
    document.body.appendChild(center.target);

    items = [];
    for (var i = 0; i < 500; i++) {
        var item = new Item("10px");
        item.backgroundColor = RandomColor();
        document.body.appendChild(item.target);
        items.push(item);
    }

    
    OnResize(null);

    items.forEach(item => item.render());
    
    run = true;
    render();
}

function render() {
    // To avoid excessive reflow first calculate the new x, y of each item...
    items.forEach(item => {
        item.moveToward(center);
    });

    // ... then update the item's position in the dom without doing any reads.
    items.forEach(item => item.render());
    
    if (run) {
        requestAnimationFrame(render);
    }
}

addEventListener("resize", OnResize);

function OnResize(e) {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    center.x = windowWidth / 2;
    center.y = windowHeight / 2;
    center.render();

    if (e === null) {
        items.forEach(item => {
            item.x = center.x + RandBetween(200, 300);
            item.y = center.y + RandBetween(200, 300);

            item.xvel = RandBetween(10, 20);
            item.yvel = 0;
        });
    }
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
        this.xaccel = 0;
        this.yaccel = 0;
        this.fg = 2.5;
        var self = this;
        this.target.addEventListener("mousedown", e => self.MouseDown(e));
    }

    moveToward(other) {
        var ang = Math.atan2(this.y - other.y, other.x - this.x);
        this.xaccel = this.fg * Math.cos(ang);
        this.yaccel = this.fg * Math.sin(ang) * -1; // * -1 because +y is down.

        this.move();
    }

    move() {
        this.xvel += this.xaccel;
        this.yvel += this.yaccel;

        var newX = this.x + (this.xvel * velocityMultiplier);
        var newY = this.y + (this.yvel * velocityMultiplier);
        var newRight = newX + this.width;
        var newBottom = newY + this.width;
        
        this.y = newY;
        this.x = newX;
        
        // this.xvel *= 0.9999;
        // this.yvel *= 0.9999;
        // this.angularVel *= 0.9999;
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