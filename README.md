Connecter Front-End Docker Container
====
[![wercker status](https://app.wercker.com/status/30e8c1fc2106f2cb44f46abd4d264ecb/m "wercker status")](https://app.wercker.com/project/bykey/30e8c1fc2106f2cb44f46abd4d264ecb)

Front-end JavaScript app packed with nginx

## Running it

```
docker run --rm -p 80:80 
   -e XMPP_BIND_URL=http://www.connecter.io/http-bind/ \
   --name meet \
   connecter/simba:latest
```

If using boot2docker get the IP address of the VM (boot2docker ip), then point a browser at it.

## Running it on CoreOS using Fleet

See here for more docs: https://coreos.com/docs/running-coreos/platforms/vagrant/

Here is how to do it locally on a Mac:

1) Install Vagrant: http://www.vagrantup.com/downloads.html

2) Download the Vagrant repo
```
git clone https://github.com/coreos/coreos-vagrant.git
cd coreos-vagrant
```

3) Create Cloud-Config
```
cp user-data.sample user.data
```
Uncomment the discovery: statement and get a token

4) Create config
```
cp config.rb.sample config.rb
```
Uncomment the two statements below, add the # of instances, and choose the 'stable' branch for CoreOS
```
# Size of the CoreOS cluster created by Vagrant
$num_instances=3
# Official CoreOS channel from which updates should be downloaded
$update_channel='stable'
```

5) Start Vagrant
```
vagrant up
```
Get status:
```
vagrant status
```

6) Install fleetctl
Go here for release info: https://github.com/coreos/fleet/releases
If you don't have homebrew installed, get it.
```
brew install fleetctl
```

7) Get the service files
Check-out the priderock repo from Bitbucket: https://sipfoundry@bitbucket.org/connecter/priderock.git

8) Establish communication with the CoreOS Vagrant cluster
```
export FLEETCTL_TUNNEL=127.0.0.1:2222
ssh-add ~/.vagrant.d/insecure_private_key
```
Add the first line to your .bash_profile file
More info: http://lukebond.ghost.io/getting-started-with-coreos-and-docker-using-vagrant/

Test the connection:
```
fleetctl list-machines
```
8) Load the service templates
```
fleetctl submit priderock/simba\@.service
fleetctl list-unit-files
```
9) Start the container
```
fleetctl start simba1.service
```
Make sure it downloads the correct container from Docker Hub. The container name is in the service file.

Check status
```
fleetctl status simba1.service
fleetctl list-machines
vagrant status
```
Point your browser at the IP address of the first host in the cluster.
