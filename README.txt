Project Overview

This document provides a step-by-step guide for setting up and running the ChatApp project. The instructions are intended for students who are new to software development and version control with Git.
Prerequisites

Before you begin, ensure the following software is installed on your computer:

    Node.js and npm: You can download these from the official Node.js website.

    Git: This version control system is used to manage and share project code.

1. Cloning the Repository

The first step is to download the project source code from GitHub to your local machine.

    Open your terminal or command prompt.

    Navigate to the directory where you want to store the project. For example:

    cd C:\Users\YourName\Documents\Projects

    Execute the following command to clone the repository:

    git clone [https://github.com/klicq/studentChatApp.git](https://github.com/klicq/studentChatApp.git)

2. Installing Dependencies

The project's dependencies were not uploaded to GitHub. They must be installed locally to run the application.

    Navigate into the studentChatApp directory:

    cd studentChatApp

    Install the front-end dependencies:

    cd frontend
    npm install

    Navigate to the back-end directory and install its dependencies:

    cd ../backend
    npm install

3. Running the Application

Once all dependencies are installed, you can start the application.

    Start the back-end server from the backend directory:

    npm start

    Open the index.html file located in the frontend directory in your preferred web browser to access the application.

4. Managing Changes with Git

As you work on the project, you will need to save your progress and upload it to GitHub.

    Navigate to the root directory of your project (studentChatApp).

    To see which files have been modified, use the git status command.

    To stage all changes for a commit, use git add ..

    To create a commit with a descriptive message, use:

    git commit -m "A brief description of the changes"

    To upload your changes to GitHub, use git push.

It is a best practice to add, commit, and push your changes frequently to save your work and keep your GitHub repository up to date.