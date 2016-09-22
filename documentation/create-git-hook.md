# Create a Git Hook

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


Navigate back to our git repo on DO

`# cd repos/awesome-soss.git`

Now we are going to create a `git bare` repo for our project

`# git init --bare`

Take a look at what is inside this git bare repo

`# ls`

You'll see a bunch of files. We are interested in the `post-receive` script.

You will see this file when you `# cd hooks`

Open that file in the VIM editor with `# vim post-receive`

Now you want to insert into this file the [following gist snippet](https://gist.github.com/bb3513be102376b9a6197f7159476077)

The important parts of this file you need to focus on now is:

`export DEPLOY_APP_NAME="awesome-soss"` - just the name of your application

`export DEPLOY_ROOT="${HOME}/repos/awesome-soss.git"` - the root deploy directory

`POST_UPDATE_CMD='cd ${DEPLOY_ROOT} && npm install && gulp --production'` - this
will install on our remote server all the `node_modules` and then it will run our
production version of gulp.

So if you open our `gulpfile.babel.js`, this is a modern version of the traditional
`gulpfile.js`. The only difference is we are using babel and it's Transpiling
ability to make sure we can use ES6.

[But this part of our gulpfile](https://gist.github.com/060f05e65aabc5092c0429a54c9063d2) allows us to create different paths whether we are
local or in production.

The cool thing about this is when we type `gulp --production` it will put our
production in the directories we want on DO.

## Give permissions to post-receive

`# chmod +x ~/repos/awesome-soss.git/hooks/post-receive`

## Set ownership and permissions of the DEPLOY_ROOT directory

`# sudo chown root:deploy -R /var/www/html/awesome-soss`
`# sudo chmod 775 /var/www/html/awesome-soss`

### Restart your nginx server

Make sure you are the root user. If you are the `deploy` user you will have to enter
your password. But if you try to switch to your root user, it will ask for your root
password, which I never know, so then I have to end my remote session by closing that
terminal window and reopeing as root via SSH

Then to restart the server:

`# sudo service nginx restart`

### On the client... (aka your local machine)

Since you cloned our repo you can blow up our git with `$ rm -rf .git`

And then intialize your own git repo with `$ git init`

Not add your first files with `$ git add -A` and commit with:
`$ git commit -m 'initialize repo'`

Now you need to add our remote DO git with:

`$ git remote add production deploy@192.241.235.95:~/repos/awesome-soss.git`

Now check to make sure you have production set up with:

`$ git remote -v`

While your at it you should set up your `origin` on Github. You can just do it
manually on Github and follow the instructions to connect your client git to GitHub.
Or you can use [Hub](https://hub.github.com/) which will allow you to create your repos from your terminal.

## Tell your Droplet how to connect your IP address to where your production directory is located

Change into this directory:

`# cd /etc/nginx/sites-available`

Open the `default` file in VIM with

`# Vim default`

Open that file and look for this line:

`root /usr/share/nginx/html;`

Comment that line out (just so you can revert to it if you blow something up)
and change it to:

`#root /usr/share/nginx/html;
root /var/www/html/awesome-soss;`

restart the server

`# sudo service nginx restart`

## Test to see if all this stuff actually works

Now just add this on the client

`$ git push production master`

You should see it connect to your remote DO box, install all the node_modules,
do all the production stuff and push it into your `/var/www/html/awesome-soss`
production file and if you browse to your Droplet IP, you should see your site!

If you get an error because of npm trying to install node_modules, it most likely
is a problem with memory allocation. All you need to do is read and follow this
[article on creating a swapfile on Ubuntu](https://github.com/Cretezy/SwapUbuntu).
