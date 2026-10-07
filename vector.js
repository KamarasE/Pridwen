export function getDirection(fromX, fromY, toX, toY) {
    const dx = toX - fromX;
    const dy = toY - fromY;

    const distance = Math.hypot(dx, dy);

    if (distance === 0) { //Ha véletlenül egy helyen lenne 2
        return {
            x: 0,
            y: 0
        };
    }

    return {
        x: dx / distance,
        y: dy / distance
    };
}