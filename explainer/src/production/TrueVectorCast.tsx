import React from "react";

export type MouthCue = "X" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

const BravoMouth: React.FC<{ cue: MouthCue }> = ({ cue }) => {
  if (cue === "X" || cue === "A") {
    return <path d="M278 325 Q300 337 322 325" fill="none" stroke="#7e382f" strokeWidth="7" strokeLinecap="round" />;
  }
  if (cue === "B" || cue === "G") {
    return (
      <g>
        <path d="M270 320 Q300 348 330 320 Q326 350 300 353 Q274 350 270 320Z" fill="#7d302d" />
        <path d="M278 325 Q300 336 322 325 L319 336 Q300 342 281 335Z" fill="#fff8ed" />
      </g>
    );
  }
  if (cue === "C" || cue === "D") {
    return (
      <g>
        <ellipse cx="300" cy="334" rx={cue === "D" ? 24 : 29} ry={cue === "D" ? 30 : 23} fill="#79302d" />
        <path d="M282 345 Q300 337 318 345 Q300 360 282 345Z" fill="#e77f79" />
      </g>
    );
  }
  if (cue === "E" || cue === "F") {
    return <ellipse cx="300" cy="334" rx={cue === "F" ? 15 : 21} ry={cue === "F" ? 25 : 19} fill="#79302d" />;
  }
  if (cue === "H") {
    return (
      <g>
        <path d="M273 327 Q300 346 327 327 Q320 357 300 358 Q280 356 273 327Z" fill="#79302d" />
        <path d="M296 345 Q305 338 316 345" fill="none" stroke="#e77f79" strokeWidth="7" strokeLinecap="round" />
      </g>
    );
  }
  return <path d="M277 329 Q300 339 323 329" fill="none" stroke="#7e382f" strokeWidth="7" strokeLinecap="round" />;
};

export const TrueVectorBravo: React.FC<{
  cue: MouthCue;
  frame: number;
  pose?: "neutral" | "present" | "point" | "listen";
  expression?: "warm" | "curious" | "worried";
}> = ({ cue, frame, pose = "neutral", expression = "warm" }) => {
  const blink = frame % 126 > 119;
  const talk = cue !== "X";
  const breath = Math.sin(frame / 26) * 1.3;
  const nod = talk ? Math.sin(frame / 10) * 0.8 : 0;
  const rightArm = pose === "point" ? -62 : pose === "present" ? -34 : 4;
  const leftArm = pose === "listen" ? 11 : -3;
  const browTilt = expression === "worried" ? 10 : expression === "curious" ? -5 : 0;

  return (
    <svg viewBox="0 0 600 1000" width="100%" height="100%" role="img" aria-label="Bravo">
      <defs>
        <linearGradient id="bravo-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd4b8" />
          <stop offset="0.58" stopColor="#f5af8b" />
          <stop offset="1" stopColor="#df8a6a" />
        </linearGradient>
        <linearGradient id="bravo-hair" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#f26832" />
          <stop offset="0.55" stopColor="#dc421f" />
          <stop offset="1" stopColor="#a92a19" />
        </linearGradient>
        <linearGradient id="bravo-vest" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b77ac" />
          <stop offset="1" stopColor="#174d78" />
        </linearGradient>
        <filter id="bravo-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#041222" floodOpacity=".28" />
        </filter>
      </defs>

      <ellipse cx="303" cy="958" rx="154" ry="22" fill="#061326" opacity=".24" />
      <g filter="url(#bravo-soft)" transform={`translate(0 ${breath})`}>
        <g>
          <path d="M222 708 Q238 692 267 699 L264 907 Q240 927 211 907 L214 742Z" fill="url(#bravo-skin)" />
          <path d="M336 699 Q365 692 380 709 L389 906 Q359 928 335 907 L338 741Z" fill="url(#bravo-skin)" />
          <path d="M209 900 Q243 889 268 908 L266 934 L174 948 Q154 941 166 925 Q180 908 209 900Z" fill="#245da8" />
          <path d="M334 908 Q360 889 392 901 Q421 909 434 928 Q442 945 420 950 L336 936Z" fill="#245da8" />
          <path d="M174 928 Q215 938 266 918 L266 938 Q207 956 166 945Z" fill="#f5eee6" />
          <path d="M337 920 Q383 939 431 930 L435 946 Q386 958 336 939Z" fill="#f5eee6" />
          <path d="M182 915 L247 907 M192 927 L252 919 M349 918 L413 929 M353 907 L405 919" stroke="#f39a3c" strokeWidth="8" strokeLinecap="round" />
          <path d="M211 858 L266 858 L266 902 Q237 914 210 902Z M335 858 L389 858 L392 902 Q363 914 336 902Z" fill="#faf9f1" />
          <path d="M215 870 L263 870 M339 870 L387 870" stroke="#4a82bf" strokeWidth="5" />
        </g>

        <path d="M180 602 Q210 564 300 558 Q390 564 423 602 L401 748 Q355 779 300 774 Q242 779 199 748Z" fill="#efd2a4" />
        <path d="M177 602 Q215 579 299 585 Q386 579 423 602 L404 751 Q356 779 300 774 Q243 779 197 750Z" fill="#e9c795" />
        <path d="M183 626 Q229 643 300 641 Q371 643 417 626 L402 749 Q352 771 300 769 Q248 772 198 749Z" fill="none" stroke="#d4aa77" strokeWidth="4" />
        <path d="M217 741 L217 665 M269 767 L273 650 M330 768 L328 650 M383 743 L382 663" stroke="#f7dfb8" strokeWidth="4" opacity=".62" />
        <path d="M188 605 Q227 578 300 581 Q374 578 414 605 L402 667 Q350 685 299 682 Q248 684 198 667Z" fill="#f1d2a5" />
        <path d="M188 604 Q206 575 229 563 L271 574 L300 590 L330 574 L372 563 Q397 575 415 604 L405 664 Q350 678 300 676 Q248 678 197 664Z" fill="#f4d9b1" />

        <g transform={`rotate(${leftArm} 205 480)`}>
          <path d="M220 459 Q190 457 174 486 L132 643 Q128 668 151 678 Q177 685 188 657 L231 520Z" fill="url(#bravo-skin)" />
          <path d="M219 454 Q188 453 171 480 L159 526 Q186 540 215 532 L236 484Z" fill="#f8f3e9" />
          <path d="M138 643 Q125 674 142 700 Q153 712 164 695 L174 676 Q164 689 156 678 Q175 672 184 652Z" fill="url(#bravo-skin)" />
        </g>

        <g transform={`rotate(${rightArm} 394 480)`}>
          <path d="M379 458 Q410 455 428 484 L467 642 Q474 668 450 679 Q423 684 414 656 L368 520Z" fill="url(#bravo-skin)" />
          <path d="M380 452 Q410 451 429 479 L442 525 Q414 539 385 532 L364 484Z" fill="#f8f3e9" />
          <path d="M461 637 Q479 655 486 678 Q490 694 477 701 Q465 706 459 691 Q458 708 446 705 Q434 701 439 684 Q426 694 419 683 Q414 672 430 659Z" fill="url(#bravo-skin)" />
        </g>

        <path d="M226 450 Q244 426 272 420 L300 449 L328 420 Q357 427 375 450 L397 644 Q347 674 300 670 Q251 674 202 644Z" fill="url(#bravo-vest)" />
        <path d="M270 421 L300 450 L330 421 L350 433 L318 474 L282 474 L249 433Z" fill="#faf7ed" />
        <path d="M225 448 Q249 428 269 423 L282 474 L300 458 L319 474 L331 423 Q353 430 375 450" fill="none" stroke="#173e62" strokeWidth="11" />
        <path d="M204 643 Q250 661 300 658 Q350 661 396 643 L398 669 Q347 687 300 684 Q251 687 201 669Z" fill="#123f68" />

        <g opacity=".98">
          <path d="M265 492 L300 456 L335 492 L300 529Z" fill="#be3f2f" />
          <path d="M229 532 L265 494 L300 532 L265 570Z" fill="#2d91c5" />
          <path d="M300 532 L335 494 L371 532 L335 570Z" fill="#2d91c5" />
          <path d="M265 572 L300 534 L335 572 L300 610Z" fill="#e4a62e" />
          <path d="M229 613 L265 574 L300 613 L265 651Z" fill="#bd3f30" />
          <path d="M300 613 L335 574 L371 613 L335 651Z" fill="#bd3f30" />
          <path d="M201 491 L229 462 L265 492 L229 532Z M335 492 L371 462 L397 491 L371 532Z" fill="#286e9e" />
          <path d="M202 573 L229 534 L265 572 L229 612Z M335 572 L371 534 L397 573 L371 612Z" fill="#286e9e" />
          <path d="M209 473 L389 652 M390 473 L211 651" stroke="#f1b438" strokeWidth="3" opacity=".64" />
        </g>

        <g transform={`rotate(${nod} 300 360)`}>
          <path d="M267 398 L267 445 Q300 468 333 445 L333 398Z" fill="url(#bravo-skin)" />
          <ellipse cx="300" cy="272" rx="154" ry="160" fill="url(#bravo-skin)" />
          <ellipse cx="154" cy="293" rx="33" ry="48" fill="url(#bravo-skin)" />
          <ellipse cx="446" cy="293" rx="33" ry="48" fill="url(#bravo-skin)" />
          <path d="M145 251 Q125 183 169 130 Q192 91 247 88 Q296 40 357 82 Q422 80 446 140 Q486 184 455 253 Q437 199 397 191 Q362 166 321 177 Q272 145 225 181 Q177 188 145 251Z" fill="url(#bravo-hair)" />
          <path d="M160 206 Q150 155 197 140 Q205 90 253 112 Q280 60 318 99 Q357 54 381 107 Q431 82 428 137 Q471 142 447 199 Q427 165 389 172 Q361 139 324 166 Q286 129 253 164 Q207 144 194 190Z" fill="#ed5428" />
          <g fill="none" stroke="#b92e1b" strokeWidth="13" strokeLinecap="round" opacity=".72">
            <path d="M181 183 Q177 142 216 149 Q239 154 226 178" />
            <path d="M235 130 Q251 93 283 112 Q302 125 286 146" />
            <path d="M301 111 Q324 75 351 104 Q368 124 346 145" />
            <path d="M360 126 Q399 99 416 137 Q426 158 403 173" />
            <path d="M207 215 Q239 185 269 207" />
          </g>
          <path d="M195 244 Q231 223 267 238" fill="none" stroke="#a53b28" strokeWidth="11" strokeLinecap="round" transform={`rotate(${browTilt} 230 240)`} />
          <path d="M333 238 Q370 222 405 244" fill="none" stroke="#a53b28" strokeWidth="11" strokeLinecap="round" transform={`rotate(${-browTilt} 370 240)`} />
          <g>
            <ellipse cx="234" cy="278" rx="48" ry={blink ? 4 : 52} fill="#fffaf1" />
            <ellipse cx="367" cy="278" rx="48" ry={blink ? 4 : 52} fill="#fffaf1" />
            {!blink && (
              <>
                <ellipse cx="240" cy="282" rx="25" ry="31" fill="#8e5a1e" />
                <ellipse cx="361" cy="282" rx="25" ry="31" fill="#8e5a1e" />
                <ellipse cx="240" cy="284" rx="13" ry="20" fill="#1b1715" />
                <ellipse cx="361" cy="284" rx="13" ry="20" fill="#1b1715" />
                <circle cx="231" cy="271" r="7" fill="#fff" />
                <circle cx="352" cy="271" r="7" fill="#fff" />
              </>
            )}
          </g>
          <g fill="none" stroke="#171b22" strokeWidth="14" strokeLinejoin="round">
            <path d="M167 247 Q224 226 288 245 L282 313 Q226 333 178 304Z" />
            <path d="M312 245 Q375 226 433 247 L422 304 Q374 333 318 313Z" />
            <path d="M285 257 Q300 248 315 257" />
            <path d="M167 257 L142 247 M433 257 L458 247" />
          </g>
          <path d="M289 287 Q282 314 292 320 Q301 326 310 317" fill="none" stroke="#d47a61" strokeWidth="6" strokeLinecap="round" />
          <circle cx="206" cy="347" r="4" fill="#c96d56" opacity=".72" />
          <circle cx="220" cy="354" r="4" fill="#c96d56" opacity=".64" />
          <circle cx="394" cy="347" r="4" fill="#c96d56" opacity=".72" />
          <circle cx="380" cy="354" r="4" fill="#c96d56" opacity=".64" />
          <BravoMouth cue={cue} />
        </g>
      </g>
    </svg>
  );
};

const PipiMouth: React.FC<{ cue: MouthCue }> = ({ cue }) => {
  if (cue === "X" || cue === "A") {
    return <path d="M254 308 Q300 335 346 308" fill="none" stroke="#31ebff" strokeWidth="12" strokeLinecap="round" />;
  }
  if (cue === "C" || cue === "D") {
    return <ellipse cx="300" cy="315" rx={cue === "D" ? 30 : 42} ry={cue === "D" ? 37 : 27} fill="none" stroke="#31ebff" strokeWidth="12" />;
  }
  if (cue === "E" || cue === "F") {
    return <ellipse cx="300" cy="315" rx="24" ry={cue === "F" ? 34 : 23} fill="none" stroke="#31ebff" strokeWidth="11" />;
  }
  if (cue === "H") {
    return <path d="M255 304 Q300 350 345 304 Q338 359 300 363 Q262 359 255 304Z" fill="none" stroke="#31ebff" strokeWidth="11" strokeLinejoin="round" />;
  }
  return <path d="M264 316 Q300 330 336 316" fill="none" stroke="#31ebff" strokeWidth="11" strokeLinecap="round" />;
};

export const TrueVectorPipi: React.FC<{
  cue: MouthCue;
  frame: number;
  expression?: "neutral" | "alarm" | "laugh" | "focused";
}> = ({ cue, frame, expression = "neutral" }) => {
  const hover = Math.sin(frame / 17) * 3;
  const rotor = frame * 34;
  const blink = frame % 102 > 96 || (expression === "laugh" && frame % 80 < 16);
  const eyeRy = expression === "alarm" ? 44 : 36;

  return (
    <svg viewBox="0 0 600 600" width="100%" height="100%" role="img" aria-label="Pipi">
      <defs>
        <radialGradient id="pipi-shell" cx="34%" cy="27%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".58" stopColor="#edf1f2" />
          <stop offset="1" stopColor="#b8c4ca" />
        </radialGradient>
        <linearGradient id="pipi-visor" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#24313b" />
          <stop offset=".52" stopColor="#0a1018" />
          <stop offset="1" stopColor="#02070c" />
        </linearGradient>
        <filter id="pipi-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="pipi-shadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#02101d" floodOpacity=".34" />
        </filter>
      </defs>
      <ellipse cx="300" cy="520" rx="178" ry="22" fill="#031326" opacity=".24" />
      <g transform={`translate(0 ${hover})`} filter="url(#pipi-shadow)">
        <path d="M156 245 L83 123 Q69 96 88 86 Q108 77 122 106 L188 209Z" fill="url(#pipi-shell)" stroke="#d5dfe3" strokeWidth="5" />
        <path d="M444 245 L517 123 Q531 96 512 86 Q492 77 478 106 L412 209Z" fill="url(#pipi-shell)" stroke="#d5dfe3" strokeWidth="5" />
        <path d="M155 325 L72 380 L36 373 L24 391 L64 407 L174 367Z" fill="#2f3942" />
        <path d="M445 325 L528 380 L564 373 L576 391 L536 407 L426 367Z" fill="#2f3942" />
        <g transform={`rotate(${rotor} 56 390)`}>
          <path d="M-8 382 Q53 374 120 388 Q59 402 -8 398Z" fill="#222934" />
          <circle cx="56" cy="390" r="13" fill="#6e7d87" />
        </g>
        <g transform={`rotate(${-rotor} 544 390)`}>
          <path d="M480 382 Q541 374 608 388 Q547 402 480 398Z" fill="#222934" />
          <circle cx="544" cy="390" r="13" fill="#6e7d87" />
        </g>
        <path d="M30 398 Q44 367 76 369 Q105 374 112 403 L104 447 Q95 472 66 474 Q38 469 31 444Z" fill="url(#pipi-shell)" stroke="#cbd7dc" strokeWidth="5" />
        <path d="M570 398 Q556 367 524 369 Q495 374 488 403 L496 447 Q505 472 534 474 Q562 469 569 444Z" fill="url(#pipi-shell)" stroke="#cbd7dc" strokeWidth="5" />
        <path d="M35 420 L106 420 L103 441 L32 441Z M494 420 L565 420 L568 441 L497 441Z" fill="#20dff6" />
        <ellipse cx="300" cy="311" rx="189" ry="191" fill="url(#pipi-shell)" stroke="#d3dde1" strokeWidth="7" />
        <path d="M150 215 Q300 133 450 215 Q474 242 462 329 Q449 390 394 418 Q300 459 206 418 Q151 390 138 329 Q126 242 150 215Z" fill="url(#pipi-visor)" stroke="#71818a" strokeWidth="8" />
        <path d="M180 217 Q286 165 411 209" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" opacity=".37" />
        <path d="M421 196 Q450 220 455 263" fill="none" stroke="#d9fbff" strokeWidth="7" strokeLinecap="round" opacity=".5" />
        <g filter="url(#pipi-glow)" fill="#31ebff">
          <ellipse cx="231" cy="278" rx="29" ry={blink ? 5 : eyeRy} />
          <ellipse cx="369" cy="278" rx="29" ry={blink ? 5 : eyeRy} />
        </g>
        {expression === "alarm" && (
          <g stroke="#31ebff" strokeWidth="10" strokeLinecap="round">
            <path d="M205 220 L252 236" />
            <path d="M395 220 L348 236" />
          </g>
        )}
        {expression === "focused" && (
          <g stroke="#31ebff" strokeWidth="9" strokeLinecap="round">
            <path d="M207 235 L252 226" />
            <path d="M393 235 L348 226" />
          </g>
        )}
        <g filter="url(#pipi-glow)"><PipiMouth cue={cue} /></g>
        <path d="M267 466 Q300 477 333 466 L327 483 Q300 491 273 483Z" fill="#495760" />
        <path d="M176 403 Q202 431 232 443 M424 403 Q398 431 368 443" fill="none" stroke="#2be3f8" strokeWidth="8" opacity=".55" />
      </g>
    </svg>
  );
};
