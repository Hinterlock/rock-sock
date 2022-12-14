title = "Rock Sock";

description = `
[Tap]  Jab
[Hold] Charge
`;

characters = [
	`
 bbbb
bbbbbb
bbrrbb
bbbrbb
bbbbbb
 bbbbb
`,
	`
 rrrr
rrrrrr
rrbbrr
rrbrrr
rrrrrr
rrrrr
`,
`
  ll
  ll
 llll
 llll
llllll
`,
];

const A = {
	WIDTH: 100,
	HEIGHT: 100
}

options = {
	viewSize: {x: A.WIDTH, y: A.HEIGHT},
	isPlayingBgm: true,
	isReplayEnabled: true,
};

let player;
let enemy;
let isPressing;
let windUp;
let jab;
let cooldown;

function update() {
	if (!ticks) {
		player = {
			x: A.WIDTH * 0.33,
			headPos: A.HEIGHT * 0.5,
			neckPos: A.HEIGHT * 0.5 + 5,
			body1Pos: A.HEIGHT * 0.5 + 12,
			body2Pos: A.HEIGHT * 0.5 + 22,
			armLength: 0
		};
		enemy = {
			x: A.WIDTH,
			headPos: A.HEIGHT * 0.5,
			neckPos: A.HEIGHT * 0.5 + 5,
			body1Pos: A.HEIGHT * 0.5 + 12,
			body2Pos: A.HEIGHT * 0.5 + 20,
			armLength: 0
		}
		isPressing = false;
		windUp = 0;
		jab = false;
		cooldown = 100;
	}
	//bg
	color("light_black");
	box(A.WIDTH/2, A.HEIGHT/2, A.WIDTH, 100);
	color("black");
	box(A.WIDTH/2, 90, A.WIDTH, 30);
	
	//lamp
	color("black");
	box(A.WIDTH/2, 10, 1, 20);
	color("black");
	char("c", A.WIDTH/2, 21);
	color("yellow");
	box(A.WIDTH/2, 25, 1);

	//player
	color("black");
	char("a", player.x, player.headPos + sin(ticks*0.04));
	color("blue");
	box(player.x, player.neckPos, 3, 8);
	box(player.x, player.body1Pos + sin(ticks*0.03), 9, 10);
	box(player.x, player.body2Pos, 7, 12);
	//arm
	box(player.x + player.armLength/2, player.body1Pos - 3 + sin(ticks*0.03), player.armLength, 3);

	//enemy
	color("black");
	char("b", enemy.x - 1, enemy.headPos + sin(ticks*0.045));
	color("red");
	box(enemy.x, enemy.neckPos, 3, 8);
	box(enemy.x, enemy.body1Pos + sin(ticks*0.035), 9, 10);
	box(enemy.x, enemy.body2Pos, 7, 10);
	//arm
	box(enemy.x - enemy.armLength/2, enemy.body1Pos - 3 + sin(ticks*0.035), enemy.armLength, 3);

	//boxing ring
	color("yellow");
	box(A.WIDTH/2, 77, A.WIDTH, 3);
	box(A.WIDTH/2, 65, A.WIDTH, 2);
	
	if (enemy.x - player.x < 25) {
		player.x -= .075;
		enemy.x -= .05;
	}

	if (enemy.x - player.x > player.armLength + enemy.armLength + 10) {
		enemy.x -= .2;
		player.x += .2;
	} else {
		if (player.armLength > enemy.armLength) {
			enemy.x += .15;
			player.x += .1;
		} else {
			player.x -= .15;
			enemy.x -= .1;
		}
	}
	if (cooldown == 0) {
		if (sin(ticks * 0.5) > .9) {
			enemy.armLength = rnd(35, (enemy.x - player.x)*1.3);
			cooldown = 30;
		}
	} else {
		cooldown--;
	}
	if (enemy.armLength > 0) {
		enemy.armLength--;
	}

	if (input.isJustPressed) {
		isPressing = true;
		windUp = 0;
	}
	if (isPressing) {
		windUp++;
	}
	if (input.isJustReleased) {
		isPressing = false;
		if (windUp < 30) {
			if (!(jab && player.armLength > 10)) { 
				play("select");
				player.armLength = 30;
				jab = true;
			}
		} else {
			play("select");
			player.armLength = windUp;
			jab = false;
		}
	} else if (player.armLength > 0) {
		if (jab) {
			player.armLength-=0.8;
		} else {
			player.armLength-=0.4;
		}
	}
	if (player.x <= 0) {
		end();
	} if (enemy.x > A.WIDTH) {
		player.x = 10;
		player.armLength = 0;
		enemy.armLength = 0;
		cooldown = 50;
		addScore(1000);
		play("lucky");
	}
	addScore(0.25);
}
