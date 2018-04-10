Find contributors of GitHub repos 
=================================

This project lets you search for GitHub repositories and display who contributed to them on a chart.

## Setup

- Download the code
- go to the project folder
- make sure you have Composer and Yarn installed 
- run
```
composer install
yarn install
``` 

## Serving the app
```
./bin/console server:run
``` 
- check output to see which IP address the app was served to (e.g: http://127.0.0.1:8000/) and go there

## Using the app
- there's on textbox on the page where users can type in the username related to a github repository (e.g: facebook), autocomplete start looking for suggestions after user has typed '/' after the username (e.g: facebook/), at this stage all repositories by this username will appear in the dropdown
- if user types in something else after "/" (this is optional), that text will be used to match repositories' names. Any names which contain that piece of text will be filtered in.
- after user has chosen a repository, a chart will appear below showing the contributors and their levels of contribution.
- if errors occur in this process (username doesn't exist, user doesn't have any repositories, repository doesn't have any contributor), the error will be showned below the textbox.

## Project's structure
- symfony 4 is used as a framework for creating a small API for this project
- webpack and babel was used to modularise and build a final js file which is included in the github/index.html.twig template
- generated assets are put in public/build
- internal assets are in "assets" which are not public

## Room for improvements:
- because suggestions are loaded dynamically instead of pre-loaded, speed might be slow. If this app were to be deployed to production, user's queries and their suggestions should be cached in the browser to improve user's experience
- I don't have much experience with responsive UI and my design skills aren't great so I did what I could to make the app looks nice
- GitHub seems to allow only 60 unauthorised API requests per IP address per hour, so if you want to make more, change your IP address frequently with VPN or alter the code to make authorised requests



