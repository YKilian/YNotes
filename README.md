# YNOTES V0.1

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
    - [Run the Server](#run-the-server)
    - [Login](#login)
    - [Create New Notes](#create-new-notes)
    - [Save a Note](#save-a-note)
    - [Download Files](#download-files)
    - [Delete Files](#delete-files)

## Introduction

Welcome to YNotes,  
this is a little project of mine about setting up a server for user registration and file management. It is not meant
for web security in any form. So please mind, that if you want to use any part of this project for your own ensure, that
the data you send is encrypted. This holds for every part even if the passwords are stored encrypted here. Also, this
project is meant for quick installation and use. I strongly recommend to change the structure of file management and
user data such that it works with SQL.  
Also note, that this project is developed on Windows 11 and with Python 3.11. There might be some issues on other OS or
Python versions.

## Installation

For the server, you need to have Python 3.11 installed. You don't need anything else.

## Usage

### Run the Server

To make this project work, you need to run `server.py`. Now, you will see a private and a public IP address.  
If you want to use this project on any other device within your network, you need to use the link that includes your
public IP address.

### Login

To use your personal note-space, you need to open the project with the link shown in the console (refer
to [Run the Server](#run-the-server)).  
Now you should see the login page on your device. If you already have an account, you can enter your login data in the
form.  
If you don't have an account, or want to create a new one, click the "Don't have an account yet?" button in the top
right corner and create a new account.

This project comes with a pre-registered account:

- **Username:** New_User
- **Password:** Test1

### Create New Notes

To create a new note, you can simply click 'New Note'. Please note that if you are editing a note and click this button,
your unsaved changes will be lost.  
The standard file format will be `.txt`. To change this, just replace it with the format you want. This has no effect on
the file itself. This is only relevant if you want to export/download the file later.  
If you want to have an object as an export, you need to fill in a space (" ").

### Save a Note <img src="./static/svg/save.svg">

To save a note, you can press `Control+S` or press the 'Save' icon in the headbar.

### Download Files <img src="./static/svg/download.svg">

To download a file, you can either click the 'Download' icon in the headbar or press `Control+E` within any opened and
saved file,  
or you can hover over the file you want to download and click the 'Download' icon in the File Overview.

### Delete Files <img src="./static/svg/delete.svg">

To delete a file, you can either click the 'Delete' icon in the headbar or press `Control+Del` within any opened file,  
or you can hover over the file you want to delete and click the 'Delete' icon in the File Overview.