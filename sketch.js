// var
const cellSize = 119;
let cells;
let t = 0;
let n_cols;
let n_rows;
let s;
let cs = 0;
let ci = 0;
let stx;
let sty;
let textSwitch = true;
let gridSwitch = true;

function createCells() {
	// get the number of cells
	n_cols = floor(width / cellSize);
	n_rows = floor(height / cellSize)
	// create the grid
	cells = [];
	for (let i = 0; i < n_cols * n_rows; i++) {
		const col = i % n_cols;
		const row = floor(i / n_cols);
		const sx0 = col * cellSize + noise(i) * cellSize;
		const sy0 = row * cellSize + noise(i) * cellSize;
		cells.push(createVector(sx0, sy0));
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	createCells();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
	createCells();
}

function draw() {
	// start drawing
	background(0);
	t += 0.025;

	// color iterator
	ci++;
	if (ci == 255) {
		ci = 0;
	}

	// grid
	if (gridSwitch == true) {
		drawGrid();
	}
	if (gridSwitch == false) {
		background(0);
	}

	// stars
	updateStars();
	drawStars();

	// text
	if (textSwitch == true) {
		showText();
	}
	if (textSwitch == false) {
		background(0, 10);
	}
}

// star shape
function star(x, y, radius1, radius2, npoints) {
	let angle = TWO_PI / npoints;
	let halfAngle = angle / 2.0;
	beginShape();
	for (let i = 0; i < TWO_PI; i += angle) {
		stx = x + cos(i) * radius2;
		sty = y + sin(i) * radius2;
		vertex(stx, sty);
		stx = x + cos(i + halfAngle) * radius1;
		sty = y + sin(i + halfAngle) * radius1;
		vertex(stx, sty);
	}
	endShape(CLOSE);
}

// draw grid
function drawGrid() {
	push();
	strokeWeight(2);
	stroke(50, 50, 50);
	// grid lines
	for (let i = 0; i < floor(width / cellSize); i++) {
		line(i * cellSize, 0, i * cellSize, height);
	}
	for (let i = 0; i < floor(height / cellSize); i++) {
		line(0, i * cellSize, width, i * cellSize);
	}
	pop();
}

// update star
function updateStars() {
	cells.forEach((s, i) => {
		const col = i % n_cols;
		const row = floor(i / n_cols);
		const sx0 = col * cellSize + noise(i) * cellSize;
		const sy0 = row * cellSize + noise(i) * cellSize;
		const bs1 = -noise(i) * cellSize;
		const bs2 = cellSize - noise(i) * cellSize;
		s.x = sx0 + 0.5 * map(cos(1.25 * t * noise(i)), -1, 1, bs1, bs2);
		s.y = sy0 + 0.5 * map(sin(2.25 * t * noise(i)), -1, 1, bs1, bs2);
		s.dm1 = 0.5 * map(cos(2 * t * noise(i)), -1.25, 1.25, bs1 * 0.25, bs2 * 0.5)
		s.dm2 = 0.5 * map(cos(1.5 * t * noise(i)), -1.25, 1.25, bs1 * 0.25, bs2 * 0.5)
	});

	for (let i = 1; i < n_cols - 1; i++) {
		for (let j = 1; j < n_rows - 1; j++) {
			const n1 = cells[(j - 1) * n_cols + (i - 1)];
			const n2 = cells[(j - 1) * n_cols + (i)];
			const n3 = cells[(j - 1) * n_cols + (i + 1)];
			const n4 = cells[(j) * n_cols + (i - 1)];

			const n5 = cells[(j) * n_cols + (i)];

			const n6 = cells[(j) * n_cols + (i + 1)];
			const n7 = cells[(j + 1) * n_cols + (i - 1)];
			const n8 = cells[(j + 1) * n_cols + (i)];
			const n9 = cells[(j + 1) * n_cols + (i + 1)];

			const neigh = [n1, n2, n3, n4, n6, n7, n8, n9];

			neigh.forEach(other => {
				let ds = n5.dist(other);
				if (ds < cellSize * 1.35) {
					ds = map(ds, 0.5 * cellSize, 1.15 * cellSize, 255, 0);
					if (cs == 0) {
						colorMode(HSB, 255);
						stroke(0, 0, ds);
					} else if (cs == 1) {
						// all colors
						stroke(ci, 255, ds);
					} else if (cs == 2) {
						colorMode(RGB, 255);
						stroke(0, 0, ds);
					} else if (cs == 3) {
						stroke(0, ds, ds);
					} else if (cs == 4) {
						stroke(0, ds, 0);
					} else if (cs == 5) {
						stroke(ds, ds, 0);
					} else if (cs == 6) {
						stroke(ds, 0, 0);
					} else if (cs == 7) {
						stroke(ds, 0, ds);
					}
					strokeWeight(4);
					line(n5.x, n5.y, other.x, other.y);
				}
			});
		}
	}
}

// draw star
function drawStars() {
	noStroke();
	cells.forEach((s, i) => {
		star(s.x, s.y, s.dm1 * noise(i) * 3, s.dm2 * noise(i) * 3, 4);
	});
}

// show text
function showText() {
	push();
	fill(0);
	stroke(255);
	strokeWeight(5);
	rectMode(CENTER);
	rect(width / 2, height / 2 - 10, 400, 200, 25);
	pop();
	push();
	textSize(25);
	textAlign(CENTER);
	textFont("helvetica");
	fill(255);
	text("Press G to toggle the grid\nPress C to change colors\nPress S to save a picture\nPress T to toggle the text",
		width / 2, height / 2 - 50);
	pop();
}

// actions
function keyTyped() {
	// save picture
	if (key == 's' || key == 'S') {
		save('Stars.png');
	}
	// toggle text
	if (key == 't' || key == 'T') {
		if (textSwitch == true) {
			textSwitch = false;
		} else if (textSwitch == false) {
			textSwitch = true;
		}
	}
	// toggle grid
	if (key == 'g' || key == 'G') {
		if (gridSwitch == true) {
			gridSwitch = false;
		} else if (gridSwitch == false) {
			gridSwitch = true;
		}
	}
	// change colors
	if (key == 'c' || key == 'C') {
		cs++;
		if (cs > 7) {
			cs = 0;
		}
	}
}
