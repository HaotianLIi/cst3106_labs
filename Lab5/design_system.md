# Design System

For this lab I kept the styles from the class sample `07_dice.css` and the lecture 5 slides (Styling, slides 106-107). The pages are in `design-system/`, `dice-design/` and `yatzy-mock-up/`.

## Colors

| Color | Hex | Where it's used |
|---|---|---|
| Light grey (primary) | #f4f4f4 | game container background, Roll Dice button |
| Grey (secondary) | #dddddd | Roll Dice button gradient |
| Black | #000000 | dice border, dots, text |
| White | #ffffff | page background |

Why I picked these:

I wanted the dice to be the main thing on the screen, so I kept the background plain light grey and the dice black. The Roll Dice button uses a gradient from #f4f4f4 to #ddd and it flips on hover, so it looks like it's being pressed without adding another color. These are also the same colors as the lecture example, so my game will match the sample code we use in class.

## Fonts

| Text | Font | Size |
|---|---|---|
| Heading (h1) | browser default | default h1 |
| Subheading (h2 / table headers) | browser default | default h2 |
| Body text | browser default | default |
| Roll Dice button | browser default | 1.2em |

The lecture CSS doesn't set a font, so I left it as the browser default. The headings and body text still look different because h1, h2 and p already have different sizes. The Roll Dice button is a bit bigger (1.2em) since it's the main button in the game.

## Dice

The dice come from `07_dice.css`:

- 100 x 100px with rounded corners (border-radius 15px)
- 1px black border, no background color
- black dots that are 20px circles
- the dots are placed with absolute positioning (top-left, middle, bottom-right, etc.)
- the 5 dice sit in a row inside `.dice-group`

I used these because they're made with only HTML and CSS, no images. The `showDie()` function in `07_dice.js` already makes this same HTML, so I can reuse it in Assignment 1.

## Components

- **Game container** (`.game-container`) - grey box, 20px padding, centered, 50% width
- **Roll Dice button** (`#rollButton`) - grey gradient, bigger text, pointer cursor
- **Scorecard** (`.scorecard`) - table with full width and collapsed borders
- **Score rows** - each row has a label and a span with an id like `onesScore`
- **Total** (`#totalScore`) - shows the total score under the scorecard
