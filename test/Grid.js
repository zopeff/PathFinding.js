var PF = require('..');
var Grid = PF.Grid;
var DiagonalMovement = PF.DiagonalMovement;

describe('Grid', function() {
    describe('generate without matrix', function() {
        var width, height, grid;

        beforeEach(function() {
            width = 10;
            height = 20;
            grid = new Grid(width, height);
        });

        it('should have correct size', function() {
            grid.width.should.equal(width);
            grid.height.should.equal(height);

            grid.nodes.length.should.equal(height);
            for (var i = 0; i < height; ++i) {
                grid.nodes[i].length.should.equal(width); 
            }
        });
        
        it('should set all nodes\' walkable attribute', function() {
            for (var i = 0; i < height; ++i) {
                for (var j = 0; j < width; ++j) {
                    grid.isWalkableAt(j, i).should.be.true;
                }
            }
        });          

        it('should call walkable when function', function() {
            grid.setWalkableAt(1, 1, function(x1,y1,x2,y2){
                return false;
            }); 
            for (var i = 0; i < height; ++i) {
                for (var j = 0; j < width; ++j) {
                    if(j==1 && i==1){
                        grid.isWalkableAt(j, i, j-1, i-1).should.be.false;    
                    }
                    else{
                        grid.isWalkableAt(j, i).should.be.true;
                    }
                }
            }
        });
    });
    
    describe('generate with walkable function', function() {
        var matrix, grid, width, height;
        var enumPos = function(f, o) {
            for (var y = 0; y < height; ++y) {
                for (var x = 0; x < width; ++x) {
                    if (o) {
                        f.call(o, x, y, grid);
                    } else {
                        f(x, y, grid);
                    }
                }
            }
        };
        beforeEach(function() {
            walkableFn = function(x1,y1,x2,y2){
                if(x1==1 && y1 == 0){
                    return false;
                }
                return true;
            };
            height = 10;
            width = 10;
            grid = new Grid(width, height, walkableFn);
        });

        it('should have correct size', function() {
            grid.width.should.equal(width);
            grid.height.should.equal(height);

            grid.nodes.length.should.equal(height);
            for (var i = 0; i < height; ++i) {
                grid.nodes[i].length.should.equal(width); 
            }
        });

        it('should initiate all nodes\' walkable attribute', function() {
            enumPos(function(x, y, g) {
                if (x==1 && y==0) {
                    g.isWalkableAt(x, y).should.be.false;
                } else {
                    g.isWalkableAt(x, y).should.be.true;
                }
            });
        });

    });

    describe('generate with matrix', function() {
        var matrix, grid, width, height;

        var enumPos = function(f, o) {
            for (var y = 0; y < height; ++y) {
                for (var x = 0; x < width; ++x) {
                    if (o) {
                        f.call(o, x, y, grid);
                    } else {
                        f(x, y, grid);
                    }
                }
            }
        };

        beforeEach(function() {
            matrix = [
                [1, 0, 0, 1],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
                [1, 0, 0, 1],
            ];
            height = matrix.length;
            width = matrix[0].length;
            grid = new Grid(width, height, matrix);
        });

        it('should have correct size', function() {
            grid.width.should.equal(width);
            grid.height.should.equal(height);

            grid.nodes.length.should.equal(height);
            for (var i = 0; i < height; ++i) {
                grid.nodes[i].length.should.equal(width); 
            }
        });

        it('should initiate all nodes\' walkable attribute', function() {
            enumPos(function(x, y, g) {
                if (matrix[y][x]) {
                    g.isWalkableAt(x, y).should.be.false;
                } else {
                    g.isWalkableAt(x, y).should.be.true;
                }
            });
        });

        it('should be able to set nodes\' walkable attribute', function() {
            enumPos(function(x, y) {
                grid.setWalkableAt(x, y, false); 
            });
            enumPos(function(x, y) {
                grid.isWalkableAt(x, y).should.be.false;
            })
            enumPos(function(x, y) {
                grid.setWalkableAt(x, y, true); 
            });
            enumPos(function(x, y) {
                grid.isWalkableAt(x, y).should.be.true;
            })
        });

        it('should return correct answer for position validity query', function() {
            var asserts = [
                [0, 0, true],
                [0, height - 1, true],
                [width - 1, 0, true],
                [width - 1, height - 1, true],
                [-1, -1, false],
                [0, -1, false],
                [-1, 0, false],
                [0, height, false],
                [width, 0, false],
                [width, height, false],
            ];

            asserts.forEach(function(v, i, a) {
                grid.isInside(v[0], v[1]).should.equal(v[2]);
            });
        });

        it('should return correct neighbors', function() {
            grid.getNeighbors(grid.nodes[1][0], DiagonalMovement.Never).should.eql([ grid.nodes[2][0] ]);
            var cmp = function(a, b) {
                return a.x * 100 + a.y - b.x * 100 - b.y;
            };
            grid.getNeighbors(grid.nodes[0][2], DiagonalMovement.IfAtMostOneObstacle).sort(cmp).should.eql([
                grid.nodes[0][1], grid.nodes[1][2], grid.nodes[1][3]
            ].sort(cmp))
        });
    });

    describe('generate with matrix and no width or height', function() {
        var matrix, grid;

        beforeEach(function() {
            matrix = [
                [1, 0, 0, 1],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
                [1, 0, 0, 1],
            ];

            grid = new Grid(matrix);
        });

        it('should have correct size', function() {
            var height = matrix.length;
            var width = matrix[0].length;

            grid.width.should.equal(width);
            grid.height.should.equal(height);

            grid.nodes.length.should.equal(height);
            for (var i = 0; i < height; ++i) {
                grid.nodes[i].length.should.equal(width);
            }
        });
    });
});
