Project Overview

This document provides a step-by-step guide for setting up and running the ChatApp project. The instructions are intended for students who are new to software development and version control with Git.
Prerequisites

Before you begin, ensure the following software is installed on your computer:

    Node.js and npm: You can download these from the official Node.js website.

    Git: This version control system is used to manage and share project code.

1. Cloning the Repository

The first step is to download the project source code from GitHub to your local computer.

    Open your terminal or command prompt.

    Navigate to the folder where you want to store the project. For example:

    cd C:\Users\YourName\Documents\Projects

    Run the following command to download the project:

    git clone [https://github.com/klicq/studentChatApp.git](https://github.com/klicq/studentChatApp.git)

2. API Key and Environment Variables

The project requires an API key to work correctly. This key is a secret and is not included in the project files.

    Get your Gemini API key from the Google AI Studio website.

    In the backend folder of the project, create a new file named .env.

    Inside this new file, copy and paste the following line, and replace YOUR_API_KEY_HERE with the key you just got:

    GEMINI_API_KEY=YOUR_API_KEY_HERE

3. Installing Dependencies

The project needs some extra files to run. These are called dependencies and must be installed.

    Navigate into the studentChatApp folder you just cloned.

    cd studentChatApp

    Go into the frontend folder and run the install command:

    cd frontend
    npm install

    Go back to the main studentChatApp folder, then enter the backend folder and run the install command:

    cd ../backend
    npm install

4. Running the Application

Now that everything is installed, you can start the application.

    Start the backend server by running the following command from the backend folder:

    npm start

    Open the index.html file located inside the frontend folder in your web browser.

5. Saving Your Changes with Git

As you work on the project, you will need to save your progress and upload it to GitHub.

    Navigate to the main studentChatApp folder.

    To see which files have been changed, use:

    git status

    To get your changed files ready for saving, use:

    git add .

    To save the changes with a short note, use:

    git commit -m "A short note about what you changed"

    To upload your changes to GitHub, use:

    git push

Remember to add, commit, and push often to keep your work safe and up-to-date on GitHub.