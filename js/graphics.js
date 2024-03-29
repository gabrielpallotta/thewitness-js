// Class responsible for drawing puzzle and snake using canvas context
class Graphics {

    constructor (layers, theme) {
        this._puzzleLayer = layers[0];
        this._snakeLayer = layers[1];

        this._width = 0;
        this._height = 0;

        this._theme = theme;
        this._ctx = null;
    }

    setPuzzle (puzzle) {
        // Store puzzle
        this._puzzle = puzzle;

        // Store puzzle options
        this._margin = puzzle.options.margin;
        this._pathSize = puzzle.options.pathSize;
        this._blockSize = puzzle.options.blockSize;
        this._rows = puzzle.options.rows;
        this._columns = puzzle.options.columns;

        // Store puzzle nodes, edges and blocks
        this._nodes = puzzle.nodes;
        this._edges = puzzle.edges;
        this._blocks = puzzle.blocks;

        // Calculate width
        this._width = 
            2 * this._margin + 
            this._columns * this._blockSize + 
            ((this._columns + 1) * this._pathSize);

        // Calculate height
        this._height = 
            2 * this._margin + 
            this._rows * this._blockSize + 
            ((this._rows + 1) * this._pathSize);

        // Adjust puzzle layer size
        this._puzzleLayer.width = this._width;
        this._puzzleLayer.height = this._height;

        // Adjust snake layer size
        this._snakeLayer.width = this._width;
        this._snakeLayer.height = this._height;
    }

///////////////////////////////////////////////////////////////////////////
// Snake drawing //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

    drawSnake (snake) {
        this.clearSnake();

        if (snake != null) {
            this._ctx = this._snakeLayer.getContext("2d");

            let node = this._puzzle.findNode(snake.stack[0]);

            this._drawCircle(node.x, node.y, Math.floor(START_RADIUS * this._pathSize),
                            this._theme.snake);

            let lastNode = node;

            // Draw all the lines (except the last one)
            for (let i = 1; i < snake.stack.length; i++) {
                node = this._puzzle.findNode(snake.stack[i]);

                this._drawLine(lastNode.x, lastNode.y, node.x, node.y, this._theme.snake, this._pathSize);

                lastNode = node;
            }

            // Draw the last line
            // if (this._puzzle.nodes[snake.lastNode] == NODE_ELEMENT_TYPE.END) {

            // }
            // else {
                if (snake.direction == DIRECTION.TOP || snake.direction == DIRECTION.BOTTOM) {
                    this._drawLine(node.x, node.y, node.x, node.y + snake.movement, this._theme.snake, this._pathSize);
                    this._drawCircle(node.x, node.y + snake.movement, Math.floor(this._pathSize / 1.3), "rgba(170, 170, 170, 0.3)");
                    this._drawCircle(node.x, node.y + snake.movement, Math.floor(this._pathSize / 1.7), "rgba(255, 255, 255, 0.5)");
                } else {
                    this._drawLine(node.x, node.y, node.x + snake.movement, node.y, this._theme.snake, this._pathSize);
                    this._drawCircle(node.x + snake.movement, node.y, Math.floor(this._pathSize / 1.3), "rgba(170, 170, 170, 0.3)");
                    this._drawCircle(node.x + snake.movement, node.y, Math.floor(this._pathSize / 1.7), "rgba(255, 255, 255, 0.5)");
                }
            // }
        }
    }

    clearSnake () {
        let ctx = this._snakeLayer.getContext("2d");
        ctx.clearRect(0, 0, this.width, this.height);
    }

///////////////////////////////////////////////////////////////////////////
// Puzzle drawing /////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

    drawPuzzle () {
        this._ctx = this._puzzleLayer.getContext("2d");

        this._drawPuzzleBackground();

        this._drawPuzzleRows();
        this._drawPuzzleColumns();

        this._drawPuzzleNodes();
        this._drawPuzzleEdges();
        this._drawPuzzleBlocks();
    }

    _drawPuzzleBackground () {
        this._drawRectangle(
            0, 0, this._width, this._height,
            this._theme.background
        );
    }

    _drawPuzzleRows () {
        for (let i = 0; i <= this._rows; i++) {
            this._drawLine(
                this._margin + this._pathSize / 2 + i * (this._blockSize + this._pathSize),
                this._margin + this._pathSize / 2, 
                this._margin +  this._pathSize / 2 + i * (this._blockSize + this._pathSize),
                this._width - this._margin - this._pathSize / 2, 
                this._theme.path, this._pathSize
            );
        }
    }

    _drawPuzzleColumns () {
        for (let i = 0; i <= this._columns; i++) {
            this._drawLine(
                this._margin + this._pathSize / 2, 
                this._margin + this._pathSize / 2 + i * (this._blockSize + this._pathSize),
                this._width - this._margin - this._pathSize / 2, 
                this._margin +  this._pathSize / 2 + i * (this._blockSize + this._pathSize),
                this._theme.path, this._pathSize
            );
        }
    }

    _drawPuzzleNodes () {
        for (let i = 0; i < this._nodes.length; i++) {
            if (this._nodes[i].element != undefined) {
                switch (this._nodes[i].element) {
                    case NODE_ELEMENT_TYPE.START:
                        this._drawStartNode(this._nodes[i]);
                        break;
                    case NODE_ELEMENT_TYPE.END:
                        this._drawEndNode(this._nodes[i]);
                        break;
                    case NODE_ELEMENT_TYPE.HEXAGON:
                        this._drawHexagonNode(this._nodes[i]);
                        break;
                }
            }
        }
    }

    _drawPuzzleEdges () {
        for (let i = 0; i < this._edges.length; i++) {
            if (this._edges[i].element != undefined) {
                switch (this._edges[i].element) {
                    case EDGE_ELEMENT_TYPE.HEXAGON:
                        this._drawHexagonEdge(this._edges[i]);
                        break;
                    case EDGE_ELEMENT_TYPE.EDGE_BREAK:
                        this._drawBreakEdge(this._edges[i]);
                        break; 
                }
            }
        }
    }
    
    _drawPuzzleBlocks () {
        for (let i = 0; i < this._blocks.length; i++) {
            if (this._blocks[i].element != undefined) {
                switch (this._blocks[i].element) {
                    case BLOCK_ELEMENT_TYPE.STAR:
                        this._drawStarBlock(this._blocks[i]);
                        break;
                    case BLOCK_ELEMENT_TYPE.CANCELATOR:
                        this._drawCancelatorBlock(this._blocks[i]);
                        break;
                }
            }
        }
    }


///////////////////////////////////////////////////////////////////////////
// Element drawing ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

    _drawStartNode (node) {
        this._drawCircle(
            node.x, node.y, 
            Math.floor(START_RADIUS * this._pathSize),
            this._theme.path
        );
    }

    _drawEndNode (node) {
        // TODO: IMPLEMENT
        // let coord = this._puzzle.getNodeCoordinate(i);
        // let ways = this._puzzle.getNodeWays(i);

        // let x = 0;
        // let y = 0;

        // let endSize = Math.floor(END_SIZE * this._puzzle.options.blockSize);

        // if (ways == [DIRECTION.RIGHT, DIRECTION.BOTTOM, DIRECTION.LEFT]) {

        // } else if (ways == [DIRECTION.BOTTOM, DIRECTION.LEFT]) {
            
        // } else if (ways == [DIRECTION.BOTTOM, DIRECTION.LEFT, DIRECTION.TOP]) {
            
        // } else if (ways == [DIRECTION.TOP, DIRECTION.LEFT]) {
            
        // } else if (ways == [DIRECTION.TOP, DIRECTION.RIGHT, DIRECTION.LEFT]) {
            
        // } else if (ways == [DIRECTION.TOP, DIRECTION.RIGHT]) {
            
        // } else if (ways == [DIRECTION.TOP, DIRECTION.RIGHT, DIRECTION.BOTTOM]) {
            
        // } else if (ways == [DIRECTION.RIGHT, DIRECTION.BOTTOM]) {

        // }
        
        // this._drawLine(coord.x, coord.y, x, y, this._theme.path, this._puzzle.pathSize);
    }

    // Change the 10 here
    _drawHexagonNode (node) {
        this._drawHexagon(node.x, node.y, 10, "#000000")
    }

    // Change the 10 here
    _drawHexagonEdge (edge) {
        this._drawHexagon(edge.x, edge.y, 10, "#000000");
    }

    _drawBreakEdge (edge) {
        this._drawRectangle(
            edge.x - this._blockSize / 6, 
            edge.y - this._blockSize / 6, 
            this._blockSize / 3, 
            this._blockSize / 3,
            this._theme.background
        );
    }

    // Change the 30 and 15 here
    _drawStarBlock (block) {
        this._ctx.save();
        
        this._drawRectangle(block.x - 15, block.y - 15, 30, 30, "#000000");
        this._ctx.translate(block.x, block.y);
        this._ctx.rotate(Math.PI / 4);
        this._drawRectangle(-15, -15, 30, 30, "#000000");

        this._ctx.restore();
    }

    // Change the 20 and 10 here
    _drawCancelatorBlock (block) {
        this._drawLine(
            block.x, block.y, block.x, block.y - 20, 
            "#FFFFFF", 10, false
        );

        this._drawLine(
            block.x, block.y, block.x - Math.floor(Math.sin(Math.PI / 3) * 20), 
            block.y + Math.cos(Math.PI / 3) * 20, "#FFFFFF", 10, false
        );

        this._drawLine(
            block.x, block.y, block.x + Math.floor(Math.sin(Math.PI / 3) * 20), 
            block.y + Math.cos(Math.PI / 3) * 20, "#FFFFFF", 10, false
        );
    }

///////////////////////////////////////////////////////////////////////////
// Shapes drawing /////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

    _drawRectangle (x, y, w, h, style) {
        let ctx = this._ctx;

        ctx.fillStyle = style;
        ctx.fillRect(x, y, w, h);
        ctx.fillRect(x, y, w, h);
    }

    _drawCircle (x, y, r, style) {
        let ctx = this._ctx;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI)
        ctx.closePath();

        ctx.fillStyle = style;

        ctx.fill();
        ctx.fill();
    }

    _drawHexagon (x, y, r, style) {
        let ctx = this._ctx;

        let sr = r / 2;
        let h  = r * Math.sqrt(3) / 2;

        ctx.beginPath();

        ctx.moveTo(x - r, y);
        ctx.lineTo(x - sr, y + h);
        ctx.lineTo(x + sr, y + h);
        ctx.lineTo(x + r, y);
        ctx.lineTo(x + sr, y - h);
        ctx.lineTo(x - sr, y - h);
        ctx.lineTo(x - r, y);

        ctx.closePath();
        
        ctx.fillStyle = style;

        ctx.fill();
        ctx.fill();
    }

    _drawLine (x1, y1, x2, y2, style, width, round)
    {
        round = typeof round !== "undefined" ? round : true;

        let ctx = this._ctx;

        ctx.beginPath();

        if (round) {
            ctx.lineCap = "round";
        } else {
            ctx.lineCap = "butt";
        }
        
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = width;
        ctx.strokeStyle = style;

        ctx.stroke();
        ctx.stroke();
    }

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

    get width ()
    {
        return this._width;
    }

    get height ()
    {
        return this._height;
    }
}
