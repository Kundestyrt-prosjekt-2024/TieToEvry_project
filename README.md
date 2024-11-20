# TieToEvry_project

Repository for Kundestyrt prosjekt H2024 - Tieotoevry Banking.

Tietoevry aims to gain insights through student collaboration on
designing a potential banking application tailored for children. The repository contains the source code for an MVP that serves as inspiration for the customer to a potential child banking-app.

Some of the features are:

1. **User Management**: The app provides a comprehensive user management module that allows
   both children and parents to register, log in, manage profiles, and handle account settings. This
   ensures that both users can easily access their respective features while keeping data secure.
2. **Balance Tracking**: Children can view their current account balance in real-time, allowing them to
   keep track of their finances. The balance is updated immediately after every transaction, fostering
   awareness of their spending and income.
3. **Chore Management and Rewards**: The app includes a chore management system, allowing
   parents to create new chores and assign them to their child. Children can view available chores,
   mark them as completed, and receive a reward upon approval. This feature is aimed at teaching
   children about earning money through tasks and responsibilities.
4. **Savings Goals**: Children can set up savings goals by specifying a name, target amount, and
   purpose. They can add funds to these savings goals from their main balance, and the progress
   toward their goal is tracked to provide a sense of accomplishment when saving up for something
   special.
5. **Spending Limits**: Parents have the ability to set spending limits for their child’s account on a
   daily, weekly, or monthly basis. This feature helps ensure that children learn about budgeting,
   managing expenses, and setting spending priorities.
6. **Educational Content**: The app includes an “Education” tab where children can explore short,
   friendly tips about saving, spending wisely, and general money management. This encourages
   children to build a foundation of financial knowledge while interacting with the app.
7. **Parental Controls**: Parents can set purchase thresholds and receive notifications for spending
   attempts that exceed set limits. This feature ensures parental oversight, giving parents the ability
   to review and approve their child’s financial activities.
8. **Summary and Notifications**: Parents have access to a summary view of their child’s account,
   showing the current balance, recent transactions, and savings goals. They can also enable notific-
   ations for significant activities, such as spending attempts or chore completion requests.

## Technologies

This project is built using:

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## Getting Started

To get a local copy up and running, follow these steps:

1. **Clone the repo**

   ```bash
   git clone https://github.com/Kundestyrt-prosjekt-2024/TieToEvry_project.git
   ```

2. **Navigate to the project repository**

   ```bash
   cd TieToEvry_project
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## Running the app

**IMPORTANT** - In order to run the app, you need the API keys to our database. Contact andretan@stud.ntnu.no for these, or if you experience any troubles during set-up.

To run the app in development mode, follow these steps:

1. Start the Expo development server

   ```bash
   npm start
   ```

2. Open the Expo Go app on your Android or iOS device.

3. Scan the QR code displayed in your terminal or browser to view the app on your device.

Alternatively, you can run the app in an Android or iOS simulator:

- For Android

  Follow [this](https://docs.expo.dev/workflow/android-studio-emulator/) guide.

  When you have followed all the steps, run

  ```bash
      npm run android
  ```

- For iOS

  Follow [this](https://docs.expo.dev/workflow/ios-simulator/) guide.

  When you have followed all the steps, run

  ```bash
      npm run ios
  ```
