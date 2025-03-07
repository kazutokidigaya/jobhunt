# Dice Roll – Simple Provably Fair Dice Game

Welcome to **Dice Roll** – a provably fair dice game built with React for the frontend and Node.js/Express for the backend. In this game, you can place a bet, roll the dice, and win credits if the outcome is favorable. The backend uses provably fair hashing (SHA-256) to ensure transparency, and the frontend includes bonus Web3 integration to simulate a crypto wallet balance. Your balance is stored on localStorage.

[Live Demo](https://dice-roll-p7dn.vercel.app/)

## Features

- **Provably Fair Gameplay:**
  - Enter your bet amount and roll the dice to get a random number between 1 and 6.
  - If the roll is 4, 5, or 6, you win (receive a 2x payout, meaning your net gain is 2x your bet).
  - If the roll is 1, 2, or 3, your bet is deducted from your balance.
- **Backend Integration:**

  - Node.js/Express backend with a `POST /roll-dice` endpoint.
  - Implements provably fair hashing using SHA-256 for transparency.
  - Updates and returns the new player balance based on the bet and dice outcome.

- **Modern User Interface:**

  - Clean, dark-themed UI built with React.
  - Animated 3D dice roll effect.
  - Real-time display of current balance (starting with 1000 credits).

- **Web3 Integration (Bonus):**
  - Simulates a crypto wallet balance using Web3.js/Ethers.js.
  - Stores player balance in localStorage.

## Installation & Setup

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/kazutokidigaya/dice-roll.git
cd dice-roll
```

#### 1.1. Install frontend Dependencies

Install the required packages:

```bash
npm install
```

#### 1.2. Start the frontend

Run the development server:

```bash
npm run dev
```

### 2. Open A new terminal for backend

```bash
cd dice-roll/backend
```

#### 2.1. Install backend Dependencies

Install the required packages:

```bash
npm install
```

#### 2.2. Start the backend

Run the development server:

```bash
npm run start
```
