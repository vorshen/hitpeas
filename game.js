var gWidth;
var gHeight;

var fps = 0;

var arrBullet = [];
var arrEnemy = [];
var jsonObj = Object.create(null);

var ctx;

var resource;
var t = Object.create(null);

var container = document.getElementById('container');
var ctx = container.getContext('2d');
var pixData;

var role = Object.create(null);

var colNumber = 16;
var rowNumber = 10;

var gScale = 1.6;
var gUnit = 0;
var drawRect = Object.create(null);

var colors = [
    'red',
    'blue',
    'green',
    'orange',
    'grey',
    'pink'
];

var space = Object.create(null);

space.length = 40;

initGlobal();

function initGlobal() {
    gWidth = window.innerWidth * 2;
    gHeight = window.innerHeight * 2;
    // UNIT = width / 10;
    // SCALE = Math.floor(UNIT / 100 * 1000) / 1000;

    container.width = gWidth;
    container.height = gHeight;

    if(gHeight / gWidth > gScale) { // 缩短高度
        gUnit = (gWidth - 20) / 10;

        drawRect.x = 10;
        drawRect.width = gWidth - 20;

        drawRect.height = gUnit * 16;
        drawRect.y = (gHeight - drawRect.height) / 2;
    } else {
        gUnit = (gHeight - 20) / 16;

        drawRect.y = 10;
        drawRect.height = (gHeight - 20);

        drawRect.width = gUnit * 10;
        drawRect.x = (gWidth - drawRect.width) / 2;
    }

}

function initUI() {
    console.log('initUI');

    getSpace();
    getBall();
    initEvent();
}


function getSpace() {
    var x, y;
    for(var i = 0; i < space.length; i++) {
        x = Math.random() * 10 >> 0;
        y = Math.random() * 16 >> 0;

        if(!space[x + '_' + y]) {
            space[x + '_' + y] = 1;

            drawSpace(x, y);
            // return ;
        } else {
            i--;
        }
    }
}

function drawSpace(x, y) {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.rect(drawRect.x + x * gUnit, drawRect.y + y * gUnit, gUnit, gUnit);
    ctx.fill();
    ctx.closePath();
}

function getBall() {
    var x, y;
    var colorMap = {
        red: 0,
        blue: 0,
        orange: 0,
        green: 0,
        grey: 0,
        yellow: 0
    };
    var color;
    var len = colors.length;
    var j;

    for(y = 0; y < 16; y++) {
        for(x = 0; x < 10; x++) {
            if(space[x + '_' + y]) {
                continue;
            }

            j = Math.random() * len >> 0;

            color = colors[j];
            colorMap[color]++;
            if(colorMap[color] > 20) {
                colors.splice(j, 1);
                len--;
            }
            drawBall(x, y, color);
        }
    }

    pixData = ctx.getImageData(0, 0, gWidth, gHeight).data;
}

function drawBall(x, y, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(drawRect.x + x * gUnit + gUnit/1.5 - gUnit/6,
            drawRect.y + y * gUnit + gUnit/1.5 - gUnit/6,
            gUnit / 3, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}

function initEvent() {
    container.addEventListener('touchstart', function(e) {
        var x = (e.targetTouches[0].clientX >> 0) * 2;
        var y = (e.targetTouches[0].clientY >> 0) * 2;

        if(x < drawRect.x || x > (drawRect.width + drawRect.x)) {
            return ;
        }

        if(y < drawRect.y || y > (drawRect.height + drawRect.y)) {
            return ;
        }

        // console.log('x:' + x, 'y:' + y);

        checkXY(x, y);


    }, false);
}

function checkXY(x, y) {
    var sx = ((x - drawRect.x) / gUnit) >> 0;
    var sy = ((y - drawRect.y) / gUnit) >> 0;

    var top = {};
    var bottom = {};
    var left = {};
    var right = {};

    if(!space[sx + '_' + sy]) {
        console.log('false');
        return ;
    }

    x = (sx * gUnit + gUnit/2 + drawRect.x) >> 0;
    y = (sy * gUnit + gUnit/2 + drawRect.y) >> 0;

    top = getPoint(x, y, 0, -1 * (gUnit));
    bottom = getPoint(x, y, 0, gUnit);
    left = getPoint(x, y, -1 * (gUnit), 0);
    right = getPoint(x, y, gUnit, 0);

    if(top.ret === bottom.ret) {
        top.dead = true;
        bottom.dead = true;
    }

    if(top.ret === left.ret) {
        top.dead = true;
        left.dead = true;
    }

    if(top.ret === right.ret) {
        top.dead = true;
        right.dead = true;
    }

    if(bottom.ret === left.ret) {
        bottom.dead = true;
        left.dead = true;
    }

    if(bottom.ret === right.ret) {
        bottom.dead = true;
        right.dead = true;
    }

    if(left.ret === right.ret) {
        left.dead = true;
        right.dead = true;
    }

/*console.log(top);
console.log(right);
console.log(bottom);
console.log(left);*/

    if(top.dead) {
        if(top.ret !== 0) {
            setPix(top.x, top.y);
            disappear(top.x, top.y);

            top.x = ((top.x - drawRect.x) / gUnit) >> 0;
            top.y = ((top.y - drawRect.y) / gUnit) >> 0;

            space[top.x + '_' + top.y] = 1;
        }
    }

    if(bottom.dead) {
        if(bottom.ret !== 0) {
            setPix(bottom.x, bottom.y);
            disappear(bottom.x, bottom.y);

            bottom.x = ((bottom.x - drawRect.x) / gUnit) >> 0;
            bottom.y = ((bottom.y - drawRect.y) / gUnit) >> 0;

            space[bottom.x + '_' + bottom.y] = 1;
        }
    }

    if(left.dead) {
        if(left.ret !== 0) {
            setPix(left.x, left.y);
            disappear(left.x, left.y);

            left.x = ((left.x - drawRect.x) / gUnit) >> 0;
            left.y = ((left.y - drawRect.y) / gUnit) >> 0;

            space[left.x + '_' + left.y] = 1;
        }
        
    }

    if(right.dead) {
        if(right.ret !== 0) {
            setPix(right.x, right.y);
            disappear(right.x, right.y);

            right.x = ((right.x - drawRect.x) / gUnit) >> 0;
            right.y = ((right.y - drawRect.y) / gUnit) >> 0;

            space[right.x + '_' + right.y] = 1;
        }
    }


    // console.log(top, bottom, left, right);
}

function getPoint(x, y, dirX, dirY) {
    var ret = 255255255;
    var nextX = x;
    var nextY = y;

    while(ret === 255255255) {
        nextX += dirX;
        nextY += dirY;

        ret = getPix(nextX, nextY);
        // drawDebug(nextX, nextY);
        if(isNaN(ret)) {
            ret = 0;
        }
    }

    return {
        ret: ret,
        x: nextX,
        y: nextY
    };
}

function setPix(x, y) {
    var start = y * gWidth * 4 + x * 4;
    pixData[start] = 255;
    pixData[start + 1] = 255;
    pixData[start + 2] = 255;

    // console.log('done');
}

function getPix(x, y) {
    var start = y * gWidth * 4 + x * 4;
    var r = pixData[start];
    var g = pixData[start + 1];
    var b = pixData[start + 2];

    return r*1000000 + g*1000 + b;
}

function disappear(x, y) {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.rect(x - gUnit/2, y - gUnit/2, gUnit, gUnit);

    // ctx.arc(x, y, gUnit / 3 + 4, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}

function drawDebug(x, y) {
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(x, y, 5, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}

initUI();



