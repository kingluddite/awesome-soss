# SSH and Digital Ocean
Now you need to connect to your Droplet using SSH.
[This tutorial](https://www.digitalocean.com/community/tutorials/how-to-connect-to-your-droplet-with-ssh) should should you how to do this.

SSH, if you are new to it, may drive you batty. Essentially, you want to
generate an SSH key on your machine and share the public key with DO. This way
DO knows you are who you say you are. [This article](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys--2) explains how to generate a SSH key better than most. I also like the [Github SSH tutorial](https://help.github.com/articles/generating-an-ssh-key/).

So if all is well, you should be able to log into your DO virtual box with

`$ ssh root@server_ip_address`

Substitute `server_ip_address` with the IP address you get when you create
your Droplet.
