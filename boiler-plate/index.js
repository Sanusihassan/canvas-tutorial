// why this is not showing anything?:
var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");
var coords = {
    x: 0,
    y: 0,
};
var MAX_RADIUS = 40;
// const MIN_RADIUS = 2;
var colors = [
    "#0abde3",
    "#feca57",
    "#576574",
    "#341f97",
    "#54a0ff",
    "#ee5253",
];
var Circle = /** @class */ (function () {
    function Circle(x, y, dx, dy, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.minRadius = this.radius;
    }
    Circle.prototype.draw = function () {
        c === null || c === void 0 ? void 0 : c.beginPath();
        c === null || c === void 0 ? void 0 : c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c === null || c === void 0 ? void 0 : c.fill();
    };
    Circle.prototype.update = function () {
        if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
        if (coords.x - this.x < 50 &&
            coords.x - this.x > -50 &&
            coords.y - this.y < 50 &&
            coords.y - this.y > -50) {
            if (this.radius <= MAX_RADIUS) {
                this.radius += 1;
            }
        }
        else {
            if (this.radius > this.minRadius) {
                this.radius -= 1;
            }
        }
        this.draw();
    };
    return Circle;
}());
document.addEventListener("DOMContentLoaded", function () {
    // Your existing code here
    if (canvas) {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }
    animate();
    // var c = canvas.getContext("2d");
    // ... rest of your code ...
});
window.addEventListener("resize", function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});
window.addEventListener("mousemove", function (_a) {
    var x = _a.x, y = _a.y;
    coords = { x: x, y: y };
});
var init = function () {
    circles = [];
    for (var i = 0; i < 800; i++) {
        var r = Math.random() * 3 + 1;
        var x = Math.random() * (innerWidth - r * 2) + r;
        var y = Math.random() * (innerHeight - r * 2) + r;
        var dx = (Math.random() - 0.5) * 8;
        var dy = (Math.random() - 0.5) * 8;
        circles.push(new Circle(x, y, dx, dy, r));
    }
};
var circles = [];
init();
// const circle = new Circle(200, 200, 2, 3, 30);
function animate() {
    c === null || c === void 0 ? void 0 : c.clearRect(0, 0, innerWidth, innerHeight);
    circles.forEach(function (circle) {
        circle.update();
    });
    requestAnimationFrame(animate);
}
