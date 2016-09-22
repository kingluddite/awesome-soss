# Awesome SOSS
`S`tructured `O`n `S`omething `S`pecial

## Description
An opinionated workflow with a focus on modern tool use, common sense, and
easily digestible instructions. Hoping the community steps in to improve this
process.

## Three parts
1. Local Development
2. Staging
3. Production

### Local Development

#### Clone Repo
Grab the files by cloning this repo.

`$ git clone https://github.com/kingluddite/awesome-soss.git`

#### Add a static type checker for JavaScript
Install Flow globally

[flowtype.org](https://flowtype.org/)

`$ npm install --global flow-bin`

#### Install Required Modules
Install all required modules with npm

`$ npm install`

#### Run Gulp

`$ gulp`

### Production

In the production environment all the JavaScript should be concatenated in the
correct order and minified into one file. This should incorporated custom
JavaScript and 3rd Party JavaScript. We found **Gulp** easier to use than
**webpack** so we used Gulp. We wanted to avoid using Bower as NPM should be able to
do everything Bower does.

#### Remote Host
Lots of hosts out there so we are going to pick one we like. Instead of using a
shared host like GoDaddy we'll use Digital Ocean (DO).

There are lots of tutorials out there but this is a [good one](https://www.digitalocean.com/community/tutorials/how-to-create-your-first-digitalocean-droplet-virtual-server)

* We set up an Ubunto image
* The cheapest one at $5/mo
* Chose a datacenter near us - San Francisco
* Chose a node application

## [How to set up SSH on Digital Ocean](/documentation/ssh-do.md)

## [Create Sudo User](/documentation/sudo-user.md)

## [Create a Git Hook](/documentation/create-git-hook.md)

### [Add SSH to your Digital Ocean Virtual Box](/documentation/do-zsh-oh-my-zsh.md)

## Current Ingredients
* all of your images will be optimized
* you can write your code using modern ES6 and babel will be used to transpile
your code into ES5 for maximum browser support
* Browser-sync is built in so you can test your site on multiple devices and
develop your app without having to constantly refresh the browser
* browser prefixes will be automatically added
* Using Bootstrap 4 and able to override it's Sass variables out of the box
* Using Flex mode of Bootstrap
* Using Modular Gulp files
* flow config will enable you to use strictly typed variables
* all vendor css can easily be added, concatenated, minified and renamed into one vendor bundle
* all vendor js can easily be added, concatenated, minified and renamed into one vendor bundle
* using font-awesome
* using hover-css, animate.css
* using jquery, tether and masonry
* with each running of gulp, old production files will be deleted and recreated
* using gulp to watch custom files so that when they are modified, they are subsequently updated
* npm can be used to install all modules
* [individual gulp files instead of one large file](http://macr.ae/article/splitting-gulpfile-multiple-files.html)

## To Be Baked In
* Flight plan
* Staging and DO subdomains
* IP to domain on DO
* Free email forwarding DO
