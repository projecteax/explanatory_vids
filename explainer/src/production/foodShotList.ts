export type Shot = "wide" | "two" | "bravoCu" | "pipiCu" | "board" | "bravoMid";

/**
 * Everyday Food and Sometimes Food — coverage after audio lock (3:05)
 *
 *  1 0:00  Pipi super fuel     WIDE (Pipi in) → PIPI CU
 *  2 0:06  Sometimes / everyday BRAVO CU → TWO
 *  3 0:16  Six foods           TWO → BOARD (foods draw, helpers inside apple)
 *  4 0:42  Apple vs candy      BRAVO MID (holds apple) → BOARD broom / empty candy
 *  5 0:58  Tummy broom joke    PIPI CU
 *  6 1:02  Sugar zap / crash   BOARD rocket kid → BRAVO CU
 *  7 1:16  Sugar on teeth      BOARD tooth + germs
 *  8 1:28  Swiss-cheese joke   PIPI CU
 *  9 1:33  Soda trick          TWO → BOARD three drinks → TWO
 * 10 1:50  Factory snacks      BOARD conveyor potato → chips
 * 11 2:12  Sometimes box joke  PIPI CU
 * 12 2:18  Wash first          BOARD faucet, dirt, no soap
 * 13 2:35  Licking joke        PIPI CU
 * 14 2:41  Food jobs           BOARD plate + mini-scenes
 * 15 2:56  Tonight mission     BOARD comic → TWO → WIDE
 */
export function shotAt(n: number, progress: number): Shot {
  switch (n) {
    case 1:
      return progress < 0.18 ? "wide" : "pipiCu";
    case 2:
      return progress < 0.36 ? "bravoCu" : "two";
    case 3:
      if (progress < 0.1) return "two";
      if (progress < 0.86) return "board";
      return "bravoMid";
    case 4:
      return progress < 0.2 ? "bravoMid" : "board";
    case 5:
      return "pipiCu";
    case 6:
      return progress < 0.74 ? "board" : "bravoCu";
    case 7:
      return "board";
    case 8:
      return "pipiCu";
    case 9:
      if (progress < 0.14) return "two";
      if (progress < 0.86) return "board";
      return "two";
    case 10:
      return "board";
    case 11:
      return "pipiCu";
    case 12:
      return "board";
    case 13:
      return "pipiCu";
    case 14:
      return "board";
    case 15:
      if (progress < 0.58) return "board";
      if (progress < 0.84) return "two";
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
  return "production/plates/lab-blackboard-wall.png";
}
