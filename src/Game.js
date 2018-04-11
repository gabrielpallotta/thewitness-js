var Game = {
    init: function (parent, theme) {
        let stage = document.createElement("div");
        let layers = new Array(2);

        for (let i = 0; i < 2; i++)
        {
            let layer = document.createElement("canvas");
            layer.style.zIndex = i;
            layer.style.position = "absolute";
            stage.appendChild(layer);
            layers[i] = layer;
        }

        parent.appendChild(stage);

        Game._stage = stage;

        Game._canvas = layers[1];
        Game._canvas.addEventListener("click", Game._mouseClick, false);

        Game._graphics = new Graphics(layers, theme);
        Game._currentPuzzle = null;

        // function frame() {
        //     Game._now = Game._timestamp();
        //     Game._dt = Game._dt + Math.min(1, (Game._now - Game._last) / 1000);
        //     while(Game._dt > Game._step) {
        //             Game._dt = Game._dt - Game._step;
        //             Game._update(Game._step);
        //     }
        //     Game._render(Game._dt);
        //     Game._last = Game._now;
        //     requestAnimationFrame(frame);
        // }

        // requestAnimationFrame(frame);
    },

    loadPuzzle : function (puzzle) {
        Game._graphics.setPuzzle(puzzle);
        Game._puzzle = puzzle;
        Game._snake = null;

        Game._stage.style.width = Game._graphics.width;
        Game._stage.style.height = Game._graphics.height;
    },

    _mouseClick: function (e) {
        let x = e.clientX - Game._canvas.offsetLeft;
        let y = e.clientY - Game._canvas.offsetTop;

        let startIndex = Game._puzzle.getStartNode(x, y);
        if (startIndex != -1)
        {
            Game._canvas.requestPointerLock();
            Game._snake = new Snake(startIndex);

            // DEBUG!!
            Game._graphics.drawSnake(Game._snake);

            Game._canvas.addEventListener('mousemove', Game._mouseMove, false);
            Game._canvas.addEventListener('pointerlockchange', Game._mouseExit, false);
        }
    },

    _mouseExit: function (e) {

    },

    _mouseMove: function (e) {
        var movementX = e.movementX || 0;
        var movementY = e.movementY || 0;

        console.log(movementX + "; " + movementY);

        // x += movementX;
        // y += movementY;
        //
        // canvasDraw();
        //
        // Rectangle(x, y, 5, 5, {radius: [0, 0, 0, 0], width: 0}, {fill: "#FFFFFF" , stroke: "#FFFFFF"}, ctx);
    },

    _update: function () {

    },

    _render: function () {

    },
}

window.onload = function main () {
    let options = {blockSize: 100, margin: 50, pathSize: 25};
    let puzzle = new Puzzle(3, 5, {}, options);
    puzzle.addElement(new Element(NODE_ELEMENT_TYPE.START, LOCATION_TYPE.NODE, {x: 0}));
    puzzle.addElement(new Element(NODE_ELEMENT_TYPE.START, LOCATION_TYPE.NODE, {x: 2}));

    let theme = new Theme("#F9B700", "#3B280A", "#FFFFFF");
    let stage = document.getElementById("stage");

    Game.init(document.body, theme);
    Game.loadPuzzle(puzzle);
}
