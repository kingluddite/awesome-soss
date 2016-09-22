# Create Sudo user

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
