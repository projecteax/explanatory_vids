export type Shot = "wide" | "two" | "bravoCu" | "pipiCu" | "board" | "bravoMid";

/**
 * Coverage, hard cuts. Camera does not drift inside a shot.
 *
 *  1 Pipi alarm     wide 1.3s (Pipi in) → Pipi CU
 *  2 Bravo warm     Bravo CU → two-shot
 *  3 Science snack  Pipi CU
 *  4 Moon is a ball Bravo mid (holds ball) → board
 *  5 Squish joke    Pipi CU
 *  6 Sunlight       board
 *  7 Cheeks joke    Pipi CU → two-shot
 *  8 Orbit          board
 *  9 Full moon      board → Bravo mid
 * 10 Cookie         Pipi CU
 * 11 New moon       board
 * 12 Still there    Pipi CU
 * 13 Crescent       board
 * 14 Banana         Pipi CU
 * 15 Half / gibbous Bravo mid (points) → board
 * 16 Month cycle    board
 * 17 Pipi summary   Pipi CU
 * 18 Look up        Bravo CU
 * 19 Mission        two-shot
 * 20 Solved         wide
 */
export function shotAt(n: number, progress: number): Shot {
  switch (n) {
    case 1:
      return progress < 0.12 ? "wide" : "pipiCu";
    case 2:
      return progress < 0.52 ? "bravoCu" : "two";
    case 3:
      return "pipiCu";
    case 4:
      return progress < 0.4 ? "bravoMid" : "board";
    case 5:
      return "pipiCu";
    case 6:
      return "board";
    case 7:
      return progress < 0.55 ? "pipiCu" : "two";
    case 8:
      return "board";
    case 9:
      return progress < 0.58 ? "board" : "bravoMid";
    case 10:
      return "pipiCu";
    case 11:
      return "board";
    case 12:
      return "pipiCu";
    case 13:
      return "board";
    case 14:
      return "pipiCu";
    case 15:
      return progress < 0.36 ? "bravoMid" : "board";
    case 16:
      return "board";
    case 17:
      return "pipiCu";
    case 18:
      return "bravoCu";
    case 19:
      return "two";
    case 20:
      return "wide";
    default:
      return "two";
  }
}

export function plateFor(shot: Shot): string {
  if (shot === "board") return "production/plates/lab-board-close.png";
  if (shot === "bravoCu" || shot === "pipiCu") {
    return "production/plates/lab-close-left.png";
  }
  if (shot === "wide" || shot === "bravoMid" || shot === "two") {
    return "production/plates/lab-blackboard-wall.png";
  }
  return "art/lab.svg";
}
