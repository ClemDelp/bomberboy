export function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
}

export function guid () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export function setPositionWithDirection (x, y, orientation, steps) {
	switch (orientation) {
		case 'down':
			y = y + steps
			break

		case 'up':
			y = y - steps
			break

		case 'right':
			x = x + steps
			break

		case 'left':
			x = x - steps
			break
	}
	return {x, y}
}
