export function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
}

export function guid () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export function setPositionWithDirection (x, y, direction) {
	switch (direction) {
		case 'down':
			y++
			break

		case 'up':
			y--
			break

		case 'right':
			x++
			break

		case 'left':
			x--
			break
	}
	return {x, y}
}
