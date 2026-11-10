export const clampSize=n=>Math.max(.25,Math.min(3,n));
export function pinchState(previous,distance){return previous?distance<.035:distance<.022}
export function scaledValue(value,delta){return Math.round(clampSize(value+delta)*100)/100}
