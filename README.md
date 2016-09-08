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

Grab the files by cloning this repo.

`$ git clone https://github.com/kingluddite/awesome-soss.git`

Install all required modules with npm

`$ npm install`

Run gulp

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

Now you need to connect to your Droplet using SSH.
[This tutorial](https://www.digitalocean.com/community/tutorials/how-to-connect-to-your-droplet-with-ssh) should should you how to do this.

SSH, if you are new to it, may drive you batty. Essentially, you want to
generate an SSH key on your machine and share the public key with DO. This way
DO knows you are who you say you are. [This article](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys--2) explains how to generate a SSH key better than most. I also like the [Github SSH tutorial](https://help.github.com/articles/generating-an-ssh-key/).

So if all is well, you should be able to log into your DO virtual box with

`$ ssh root@server_ip_address`

Substitute `server_ip_address` with the IP address you get when you create
your Droplet.

Now you are logged in as root which is cool but we need to create another user
that we will use to work some git magic. Doing everything as the root user is
a bad idea because root has unlimited power. It is highly recommended to create
a sudo user and use that user instead of root. [This article](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-14-04) does a good job at explaining how to create a new user on ubunto and why it is
a good idea.

### Create a Sudo User on Ubuntu

We are going to create a user named `deploy` and we are going to give the user
sudo priviliges.

Log in to your remote server as the `root` user
`$ ssh root@server_ip_address`

**note** In the tutorial, I will use `$` to represent your client Terminal
(aka your local machine)

Now that you are logged in as root you are going to add a user named 'deploy'.
Do this with:

`# adduser deploy`

**note** In this tutorial, I will use `#` to represent your remote server (aka
your Droplet on DO)

Now you will be prompted for a new UNIX password and to confirm this password.
I use LastPass is a cool tool free tool to use to generate strong passwords.
Generate one. Copy and save it somewhere you won't forget about because you will
need that password again. Trust me. After you confirm the same password, you will
be prompted to enter all the user's information. You can just hit enter to
accept all the default values.

Now you need to add your new `deploy` user to the sudo group. Do that with this:

`# usermod -aG sudo deploy`

By default, on Ubunto, members of the `sudo` group have sudo privileges.

### Test your new sudo user

If you created your sudo user properly

`# su - deploy`

That should switch you from your `root` user to your `deploy` user.

The first time you use `sudo` in a session, you will be prompted for the password
of the user account. You saved it safe. Go grab it and enter it.

Now you have a sudo user named `deploy` with root privileges.

I kind of borrowed a lot of this part of the tutorial [from this DO document](https://www.digitalocean.com/community/tutorials/how-to-create-a-sudo-user-on-ubuntu-quickstart).

## Git to the rescue

So now we need to work with Git. Most people use Git and Github together for
version control. We are going to use Git to push our code to our remote box,
then we'll use a hook of Git's to run some cool code that will work some magic
for us. We will install our node_modules packages our app is using on the remote
server. We will also run our production gulp code to grab our CSS and JavaScript
and minify it. We will also concatenate all our JavaScript code (custom and external)
in the proper order (this is important because JavaScript is asynchronous by nature
so it may run our JavaScript in the wrong order if we are not careful). We
will order and concatenate our JavaScript files first before uglifying it (
which just means minifying it). We won't have to concatenate our CSS
because we are using Sass and it does all the concatenation for us. But since
we will be using Bootstrap 4 and it's own Sass we'll need to figure out a way
to import that Sass (so we can override it using it's variables if we want) and
pull it in with our custom Sass and then minify all of them.

So this is where things get a little confusing so try your best to follow along.
We will create a folder here `/var/www/html`. This is the traditional structure
when working with nginx so we'll use it for simplicity.

Log in as root user and make sure /var/www/html exists. If not create it with

`# mkdir -p /var/www/html`

Now create your repos folder in your user directory. You created the `deploy`
user so now our repos folder will be in this user's home directory

Log in as the deploy user.

`# su - deploy`

Find the path of where you are:

`# pwd`

You should see:

`/home/deploy`

Create a repos directory

`# mkdir repos`

Now create a folder inside that repo.

`# mkdir repos/awesome-soss.git`

We name our git repo `awesome-soss.git` but you can name yours anything. But we
recommend adding the `.git` at the end of your repo name.

### SSH for deploy user

We have SSH for our root user but not for our deploy user. Let's set that up now.

Make sure you are logged in as the `deploy` user.

`# cd ~`

Now you are in the deploy user home directory.

Create the .ssh folder

`mkdir -p .ssh`

Now create and open the `authorized_keys` file. This file can hold your public
SSH key (the one you created on your local machine). It can actually hold
many SSH keys.
Once you have the file open in the VIM editor, copy your local SSH key.

If you are on Mac, this is an easy way to copy your public SSH key

`$ cat ~/.ssh/id_rsa.pub | pbcopy`

That command will grab your id_rsa.pub on your local machine and copy it to your
clipboard. Then in the VIM editor on the remote machine paste it inside the
`authorized_keys` file.

To get out of VIM. Type `:` and `wq!`
The `w` is to `write`, the `q` is to quit and the `!` is to force the quit.

If entered correctly, you should be out of the `authorized_keys` file and back
in the regular terminal

### Make your Droplet terminal window look cooler.

Add ZSH and oh-my-zsh to your DO Droplet.
Install ZSH on the Droplet

As root user:





Get SSH working on your remote server
Log in as root



For Production do this
`$ npm install --production`

## Tools Using
* jshint with ES6
* babel
  - Transpiling ES5 to ES6 (and future ES versions)
* Browser-Sync
  - Live reloading your website, but it’s not constrained to one browser or even one device
  - [video example](https://www.youtube.com/watch?v=wPIn5AS3DCk)
* Gulp
  - Development Dependencies
    + babel-cli
    + babel-plugin-transform-flow-strip-types
    + babel-preset-es2015-node5
    + babel-preset-stage-0
    + browser-sync
    + del
    + gulp
    + gulp-autoprefixer
    + gulp-babel
    + gulp-cache
    + gulp-cssnano
      *  minify the concatenated CSS
    + gulp-header
    + gulp-if-else
    + gulp-imagemin
      * helps us minify png, jpg, gif, svg and ico
    + gulp-jshint
    + gulp-load-plugins
    + gulp-newer
    + gulp-plumber
    + gulp-rename
    + gulp-sass
    + gulp-shell
    + gulp-sourcemaps
    + gulp-uglify
    + gulp-util
    + gulp-watch
    + jshint
    + rimraf
    + run-sequence
    + yargs
  - Dependencies
    + bootstrap 4
    + font-awesome
* Node
* Bootstrap 4
  - using npm
  - scss
* development folder
  - src
* productuction folder
  - dist
* Facebook Flow
* Git
  - git hooks
* SSH
  - SSH public key
* .editorconfig
* not using bower and trying to do everything with node
